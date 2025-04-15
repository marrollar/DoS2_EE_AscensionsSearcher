import re
import string

from bs4 import BeautifulSoup

from constants import MODIFIED_AMER_ARTIFACTS_DESC_FILE, EPIPS_ARTIFACTS_FILE, HTML_GT
from sql import CREATE_TABLE_ARTIFACTS, INSERT_TABLE_ARTIFACTS, t_ARTIFACTS

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


def no_punctuation(s):
    return "".join(c for c in s.lower() if c not in string.punctuation and not c.isspace())


def fix_some_arti_names(name):
    # Coruscating Silks is typoed >:T
    if name == "CorruscatingSilks":
        return "coruscatingsilks", "Coruscating Silks"
    # Certain artifacts need an extra "The" in front
    elif name == "ButchersDisciple":
        return "thebutchersdisciple", "The Butcher's Disciple"
    elif name == "ButchersWill":
        return "thebutcherswill", "The Butcher's Will"
    elif name == "Cannibal":
        return "thecannibal", "The Cannibal"
    elif name == "Chthonian":
        return "thechthonian", "The Chthonian"
    elif name == "Crucible":
        return "thecrucible", "The Crucible"
    elif name == "Jaguar":
        return "thejaguar", "The Jaguar"
    elif name == "LocustCrown":
        return "thelocustcrown", "The Locust Crown"
    elif name == "Savage":
        return "thesavage", "The Savage"
    elif name == "Vault":
        return "thevault", "The Vault"
    # Certain artifacts need their possesive-ness added back in
    elif name == "AngelsEgg":
        return "angelsegg", "Angel's Egg"
    elif name == "ApothecarysGuile":
        return "apothecarysguile", "Apothecary's Guile"
    elif name == "DrogsLuck":
        return "drogsluck", "Drog's Luck"
    elif name == "GiantsSkull":
        return "giantsskull", "Giant's Skull"
    # De-cap some names
    elif name == "EyeOfTheStorm":
        return "eyeofthestorm", "Eye of the Storm"
    elif name == "FaceOfTheFallen":
        return "faceofthefallen", "Face of the Fallen"
    # Gram, Sword of Grief causing me grief
    elif name == "GramSwordOfGrief":
        return "gramswordofgrief", "Gram, Sword of Grief"
    else:
        return no_punctuation(name), re.sub(r"([a-z])([A-Z])", r"\1 \2", name)


def sanitize_description(desc):
    return (
        desc
        .replace('Artifact Power:<font size="17">', "")
        .replace("</font>", "")
        .replace("<br>- ", HTML_GT, 1)
        .replace("<br>- ", f"<br>{HTML_GT}")
    )

def parse_artifacts(cur, conn, TEMP_INTERMEDIATE_TABLES=True):
    CREATE_TABLE_ARTIFACTS(cur, conn, TEMP_INTERMEDIATE_TABLES)

    artifact_names = {}

    with open(EPIPS_ARTIFACTS_FILE, "r", encoding="utf-8") as f:
        pattern = re.compile(THE_NUCLEAR_OPTION)

        for match in re.finditer(pattern, f.read()):
            artifact_name = match.group(0).split("=")[0].strip().split("_")[1]
            simplified, display = fix_some_arti_names(artifact_name)
            artifact_names[simplified] = display

    with open(MODIFIED_AMER_ARTIFACTS_DESC_FILE, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f.read(), "xml")
        tl_nodes = soup.find_all(name="node", id="TranslatedStringKey")

        for node in tl_nodes:
            # Entries look like: AMER_ARTIFACTPOWER_ABSENCE_DisplayName
            uuid = node.find("attribute", id="UUID").get("value")

            if uuid.startswith("AMER_ARTIFACTPOWER_"):
                simplified_name = no_punctuation(uuid.split("_")[2])
                content = node.find("attribute", id="Content")

                href = content.get("handle")
                display_name = artifact_names[simplified_name]
                desc = sanitize_description(content.get("value"))

                INSERT_TABLE_ARTIFACTS(
                    cur,
                    conn,
                    (t_ARTIFACTS.href, href),
                    (t_ARTIFACTS.aname, display_name),
                    (t_ARTIFACTS.orig, desc)
                )


def parse_for_derpys_descs():
    pass
