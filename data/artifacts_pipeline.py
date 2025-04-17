import re
import string

from bs4 import BeautifulSoup

from constants import (
    EE_KEY_WORDS,
    HTML_COLOR_KEYWORD,
    HTML_GT,
    ORIGINAL_DERPYS_LOCAL, EPIP_ARTIFACTS_FILE,
)
from sql import CREATE_TABLE_ARTIFACTS, t_ARTIFACTS, INSERT_TABLE_ARTIFACTS

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

# Same as above
AMER_ICONS_NUCLEAR_OPTION = r"""
((new entry "AMER_ARTIFACTPOWER_[A-Z]+_DISPLAY")
(type "StatusData")
(data "StatusType" "CONSUME")
(data "Description" "AMER_ARTIFACTPOWER_[A-Z]+_DISPLAY_Description")
(^data "DescriptionRef" ".+")
(^data "Icon" "AMER_.+"))"""


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


def parse_artifacts(cur, conn):
    CREATE_TABLE_ARTIFACTS(cur, conn)

    artifact_names = {}

    with open(EPIP_ARTIFACTS_FILE, "r", encoding="utf-8") as f:
        pattern = re.compile(THE_NUCLEAR_OPTION)

        for match in re.finditer(pattern, f.read()):
            tokens = match.group(0).split("\n")

            artifact_name = tokens[1].split("=")[0].strip().split("_")[1]
            simplified, display = fix_some_arti_names(artifact_name)

            slot = tokens[3].split("=")[1].strip('", ')

            artifact_names[simplified] = {
                "name": display,
                "slot": slot
            }

    print(artifact_names)

    # with open(MODIFIED_AMER_ARTIFACTS_DESC_FILE, "r", encoding="utf-8") as f:
    #     soup = BeautifulSoup(f.read(), "xml")
    #     tl_nodes = soup.find_all(name="node", id="TranslatedStringKey")
    #
    #     for node in tl_nodes:
    #         # Entries look like: AMER_ARTIFACTPOWER_ABSENCE_DisplayName
    #         uuid = node.find("attribute", id="UUID").get("value")
    #
    #         if uuid.startswith("AMER_ARTIFACTPOWER_"):
    #             simplified_name = no_punctuation(uuid.split("_")[2])
    #             content = node.find("attribute", id="Content")
    #
    #             href = content.get("handle")
    #             display_name = artifact_names[simplified_name]["name"]
    #             slot = artifact_names[simplified_name]["slot"]
    #             desc = sanitize_description(content.get("value"))
    #
    #             for keyword in EE_KEY_WORDS:
    #                 desc = desc.replace(keyword, HTML_COLOR_KEYWORD(keyword))
    #
    #             INSERT_TABLE_ARTIFACTS(
    #                 cur,
    #                 conn,
    #                 (t_ARTIFACTS.href, href),
    #                 (t_ARTIFACTS.aname, display_name),
    #                 (t_ARTIFACTS.orig, desc),
    #                 (t_ARTIFACTS.slot, slot)
    #             )


# def parse_for_derpys_descs(cur, conn):
#     orig_descs = cur.execute(f"SELECT {t_ARTIFACTS.href}, {t_ARTIFACTS.orig} FROM {t_ARTIFACTS._name}").fetchall()
#     orig_descs = {i[0]: i[1] for i in orig_descs}
#
#     derpys_tls = {}
#
#     with open(ORIGINAL_DERPYS_LOCAL, "r", encoding="utf-8") as f:
#         soup = BeautifulSoup(f.read(), "xml")
#         tags = soup.find_all("content")
#
#         for tag in tags:
#             derpy_href = tag.get("contentuid")
#             if derpy_href in orig_descs.keys():
#                 text = tag.getText()
#                 derpys_tls[derpy_href] = sanitize_description(text)
#
#     for href, derpy_desc in derpys_tls.items():
#         for keyword in EE_KEY_WORDS:
#             derpy_desc = derpy_desc.replace(keyword, HTML_COLOR_KEYWORD(keyword))
#
#         cur.execute(f"""
#             UPDATE {t_ARTIFACTS._name}
#             SET {t_ARTIFACTS.derpys}=?
#             WHERE {t_ARTIFACTS.href}=?
#         """, (derpy_desc, href))
#         conn.commit()
#
#
# def parse_for_icons(cur, conn):
#     all_artifacts = cur.execute(f"""
#         SELECT {t_ARTIFACTS.href}, {t_ARTIFACTS.aname}, {t_ARTIFACTS.orig}
#         FROM {t_ARTIFACTS._name}
#     """).fetchall()
#     all_artifacts = {no_punctuation(name): {"href": href, "desc": orig} for href, name, orig in all_artifacts}
#
#     with open(AMER_ARTIFACTS_ICON_REF_FILE, "r", encoding="utf-8") as f:
#         pattern = re.compile(AMER_ICONS_NUCLEAR_OPTION, re.MULTILINE)
#
#         for match in re.finditer(pattern, f.read()):
#             groups = match.groups()
#
#             name = no_punctuation(groups[1].split("_")[2])
#             desc = groups[5]
#             icon_ref = groups[6].split(" ")[2].strip('"').strip('" ')
#
#             desc = desc[desc.index(" ", desc.index(" ") + 1):].strip('" ')
#             desc = sanitize_description(desc)
#
#             for keyword in EE_KEY_WORDS:
#                 desc = desc.replace(keyword, HTML_COLOR_KEYWORD(keyword))
#
#             href = all_artifacts[name]["href"]
#
#             cur.execute(f"""
#                 UPDATE {t_ARTIFACTS._name}
#                 SET {t_ARTIFACTS.icon} = ?
#                 WHERE {t_ARTIFACTS.href} = ?
#             """, (icon_ref, href))
#             conn.commit()
#
#             orig_text = BeautifulSoup(all_artifacts[name]["desc"], "html.parser").get_text()
#             cur_text = BeautifulSoup(desc, "html.parser").get_text()
#
#             if orig_text != cur_text:
#                 print(name)
#                 print(orig_text)
#                 print(cur_text)
#                 print()
#
