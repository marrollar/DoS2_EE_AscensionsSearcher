import os
import re
import string

from bs4 import BeautifulSoup
from constants import (
    EE_ARTIFACTS_DESC_FILE,
    EE_ROOT_TEMPLATES,
    EPIP_ARTIFACTS_FILE,
    HTML_GT,
    ORIGINAL_DERPYS_LOCAL, EE_KEY_WORDS, HTML_COLOR_KEYWORD,
)
from sql import CREATE_TABLE_ARTIFACTS, INSERT_TABLE_ARTIFACTS, t_ARTIFACTS
from tqdm import tqdm

# Don't touch this unless you know what you're doing
# Every line is rather particular
THE_NUCLEAR_OPTION = r"""
(\s+Artifact_\S+ = {
\s+ID = "Artifact_\S+",
\s+Slot = "\S+",
\s+ItemTemplate = "\S+",
\s+RuneTemplate = "\S+",
\s+KeywordActivators = {(?:"\S+"[,\s]*)*},
\s+KeywordMutators = {(?:"\S+"[,\s]*)*},
\s+DescriptionHandle = "\S+",
\s+},)"""

# # Same as above
# AMER_ICONS_NUCLEAR_OPTION = r"""
# ((new entry "AMER_ARTIFACTPOWER_[A-Z]+_DISPLAY")
# (type "StatusData")
# (data "StatusType" "CONSUME")
# (data "Description" "AMER_ARTIFACTPOWER_[A-Z]+_DISPLAY_Description")
# (^data "DescriptionRef" ".+")
# (^data "Icon" "AMER_.+"))"""


def no_punctuation(s):
    return "".join(c for c in s.lower() if c not in string.punctuation and not c.isspace())


def fix_some_arti_names(name):
    arti_map = {
        # Coruscating Silks is typoed >:T
        "CorruscatingSilks".lower(): ("coruscatingsilks", "Coruscating Silks"),
        # Certain artifacts need an extra "The" in front
        "ButchersDisciple".lower(): ("thebutchersdisciple", "The Butcher's Disciple"),
        "ButchersWill".lower(): ("thebutcherswill", "The Butcher's Will"),
        "Cannibal".lower(): ("thecannibal", "The Cannibal"),
        "Chthonian".lower(): ("thechthonian", "The Chthonian"),
        "Crucible".lower(): ("thecrucible", "The Crucible"),
        "Jaguar".lower(): ("thejaguar", "The Jaguar"),
        "LocustCrown".lower(): ("thelocustcrown", "The Locust Crown"),
        "Savage".lower(): ("thesavage", "The Savage"),
        "Vault".lower(): ("thevault", "The Vault"),
        # Certain artifacts need their possessive-ness added back in
        "AngelsEgg".lower(): ("angelsegg", "Angel's Egg"),
        "ApothecarysGuile".lower(): ("apothecarysguile", "Apothecary's Guile"),
        "DrogsLuck".lower(): ("drogsluck", "Drog's Luck"),
        "GiantsSkull".lower(): ("giantsskull", "Giant's Skull"),
        # De-cap some names
        "EyeOfTheStorm".lower(): ("eyeofthestorm", "Eye of the Storm"),
        "FaceOfTheFallen".lower(): ("faceofthefallen", "Face of the Fallen"),
        # Gram, Sword of Grief causing me grief
        "GramSwordOfGrief".lower(): ("gramswordofgrief", "Gram, Sword of Grief"),
    }

    try:
        return arti_map[name.lower()]
    except KeyError:
        return no_punctuation(name), re.sub(r"([a-z])([A-Z])", r"\1 \2", name)


def sanitize_description(desc):
    return (
        desc
        .replace('Artifact Power:<font size="17">', "")
        .replace("</font>", "")
        .replace("<br>- ", f"{HTML_GT} ", 1)
        .replace("<br>- ", f"<br>{HTML_GT} ")
    )


def parse_artifacts_geartype(cur, conn):
    CREATE_TABLE_ARTIFACTS(cur, conn)
    artifact_names = {}

    with open(EPIP_ARTIFACTS_FILE, "r", encoding="utf-8") as f:
        pattern = re.compile(THE_NUCLEAR_OPTION)

        for match in tqdm(re.finditer(pattern, f.read()), desc="Parsing for display names for artifacts"):
            tokens = match.group(0).split("\n")

            artifact_name = tokens[1].split("=")[0].strip().split("_")[1]
            simplified, display = fix_some_arti_names(artifact_name)

            slot = tokens[3].split("=")[1].strip('", ')

            artifact_names[simplified] = {
                "name": display,
                "slot": slot
            }

    return artifact_names


def parse_artifacts_icons(artifacts):
    for file_path in tqdm(os.listdir(EE_ROOT_TEMPLATES), desc="Parsing for icon references for artifacts"):
        rel_path = os.path.join(EE_ROOT_TEMPLATES, file_path)

        if rel_path.endswith(".lsx") and not file_path.startswith("_merged"):
            with open(rel_path, "r", encoding="utf-8") as f:
                soup = BeautifulSoup(f.read(), "xml")

                try:
                    name = soup.find("attribute", id="Stats").get("value").split("_")[-1]
                    icon = soup.find("attribute", id="Icon").get("value")

                    try:
                        artifacts[no_punctuation(name)]["icon"] = icon
                    except KeyError:
                        continue
                except AttributeError:
                    continue

    for v in artifacts.values():
        assert len(v) == 3

    return artifacts


def parse_orig_artifact_descriptions(artifacts):
    with open(EE_ARTIFACTS_DESC_FILE, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f.read(), "xml")

        for node in tqdm(soup.find_all("node", id="TranslatedStringKey"),
                         desc="Parsing for original descriptions for artifacts"):

            href = node.find("attribute", id="Content").get("handle")
            desc = node.find("attribute", id="Content").get("value")
            uuid = node.find("attribute", id="UUID").get("value")

            if uuid.startswith("AMER_ARTIFACTPOWER_"):
                desc = sanitize_description(desc)
                name = no_punctuation(uuid.split("_")[2])

                artifacts[name]["href"] = href
                artifacts[name]["orig"] = desc

    for v in artifacts.values():
        assert len(v) == 5

    return artifacts


def parse_derpys_artifact_descriptions(cur, conn, artifacts):
    with open(ORIGINAL_DERPYS_LOCAL, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f.read(), "xml")

        for content_node in tqdm(soup.find_all("content"), desc="Parsing for Derpy's artifact changes"):
            href = content_node.get("contentuid")
            desc = sanitize_description(content_node.get_text())

            for k, v in artifacts.items():
                if href == v["href"]:
                    artifacts[k]["derpys"] = desc

    for v in artifacts.values():
        name = v["name"]
        slot = v["slot"]
        icon = v["icon"]
        href = v["href"]
        orig = v["orig"]
        try:
            derpys = v["derpys"]
        except KeyError:
            derpys = ""

        # for keyword in EE_KEY_WORDS:
        #     orig = orig.replace(keyword, HTML_COLOR_KEYWORD(keyword))
        # for keyword in EE_KEY_WORDS:
        #     derpys = derpys.replace(keyword, HTML_COLOR_KEYWORD(keyword))

        INSERT_TABLE_ARTIFACTS(
            cur,
            conn,
            (t_ARTIFACTS.href, href),
            (t_ARTIFACTS.aname, name),
            (t_ARTIFACTS.orig, orig),
            (t_ARTIFACTS.derpys, derpys),
            (t_ARTIFACTS.icon, icon),
            (t_ARTIFACTS.slot, slot)
        )
