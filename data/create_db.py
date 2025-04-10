import argparse
import os
import shutil
import sqlite3

from bs4 import BeautifulSoup

# This file is found in the unpack of 'Epic_Encounters_Core'. Note that the copy of it in the repo has been renamed, but the contents are not altered.
# The path after unpack is:
# /Mods/Epic_Encounters_Core/Localization/AMER_UI_Ascension.lsx
ORIGINAL_EE_LOCALIZATION_FILE = "_ORIGINAL_AMER_UI_Ascension.lsx"
MODIFIED_EE_LOCALIZATION_FILE = "MODIFIED_AMER_UI_Ascension.lsx"

# The path after unpack is:
# /Story/RawFiles/Goals/AMER_GLO_UI_Ascension_NodeRewards_Definitions.txt
NODE_REWARDS_FILE = "AMER_GLO_UI_Ascension_NodeRewards_Definitions.txt"

# This file is found in the unpack of 'Derpy's EE2 Tweaks'.
# The path after unpack is:
# /Mods/Derpy's EE2 tweaks/Story/RawFiles/Lua/PipsFancyUIStuff.lua
DERPYS_CHANGES_FILE = "PipsFancyUIStuff.lua"

DB_NAME = "ascensions.db"
ORM_DIR = "../client/prisma"

if not os.path.isdir(ORM_DIR):
    raise (
        "ERROR: The website's ORM folder was not found. Please check to see the repo was cloned properly."
    )

EE_KEY_WORDS = [
    "Elementalist",
    "Paucity",
    "Predator",
    "Violent Strikes",
    "Occultist",
    "Vitality Void",
    "Withered",
    "Wither",
    "Abeyance",
    "Adaptation",
    "Centurion",
    "Benevolence",
    "Celestial",
    "Ward",
    "Prosperity",
    "Purity",
    "Defiance",
]

conn = sqlite3.connect(DB_NAME)
cur = conn.cursor()


def clean_bad_chars():
    """
    The localization contains a bunch of non UTF-8 characters, which will mess with rendering later, so we replace them with closest approximations.
    """
    if not os.path.isfile(ORIGINAL_EE_LOCALIZATION_FILE):
        raise ("ERROR: Original localization file for EE was not found")

    with open(ORIGINAL_EE_LOCALIZATION_FILE, "r+", encoding="utf-8") as f:
        text = f.read()
        text = text.replace("\u2019", "'")
        text = text.replace("\u00bb", ">")

    with open(MODIFIED_EE_LOCALIZATION_FILE, "w") as f:
        f.write(text)


def parse_for_descriptions():
    """
    Parses a character sanitized version of Epic_Encounters_Core/Localization/AMER_UI_Ascension.lsx to extract out the node descriptions for all ascensions.
    There are unused and duplicate descriptions which are not handled in this function; they are handled later.
    """
    if not os.path.isfile(MODIFIED_EE_LOCALIZATION_FILE):
        raise (
            "ERROR: Somehow, modifications to the localization file didnt manage to get saved, or something really bad happened to it somewhere."
        )

    ascension_prefixes = [
        "AMER_UI_Ascension_Force_",
        "AMER_UI_Ascension_Entropy_",
        "AMER_UI_Ascension_Form_",
        "AMER_UI_Ascension_Inertia_",
        "AMER_UI_Ascension_Life_",
    ]

    cur.execute(
        """
        CREATE TEMP TABLE core (
            href TEXT NOT NULL,
            aspect TEXT NOT NULL,
            cluster TEXT NOT NULL,
            attr TEXT NOT NULL,
            description TEXT NOT NULL,
            is_subnode INTEGER,
            has_implicit INTEGER,

            PRIMARY KEY (aspect, cluster, attr)
        )
        """
    )
    conn.commit()

    with open(MODIFIED_EE_LOCALIZATION_FILE, "r") as f:
        """
        This is an example of an entry we are attempting to parse:

        <node id="TranslatedStringKey">
            <attribute id="Content" type="28" handle="h81742daeg1cbfg4f08gb4b2gf93b7970bc6d" value="&lt;p align='left'&gt;&lt;font color='a8a8a8' size='21' face='Averia Serif'&gt;Click on this node again to allocate it, granting:&lt;/font&gt;&lt;br&gt;&lt;font color='cb9780'&gt;»&lt;/font&gt; +5% Fire Resistance.&lt;/p&gt;" />
            <attribute id="ExtraData" type="23" value="" />
            <attribute id="Speaker" type="22" value="" />
            <attribute id="Stub" type="19" value="True" />
            <attribute id="UUID" type="22" value="AMER_UI_Ascension_Force_TheHatchet_Node_0.1" />
        </node>

        The description is extracted from Content.
        The aspect, cluster and node is extracted from UUID.
        """

        soup = BeautifulSoup(f.read(), "xml")
        tl_nodes = soup.find_all(id="TranslatedStringKey")

        for node in tl_nodes:
            uuid = node.find("attribute", id="UUID").get("value")

            if any(uuid.startswith(prefix) for prefix in ascension_prefixes):
                content = node.find("attribute", id="Content")
                content_href = content.get("handle")

                # Preprocess some of the HTML so the server doesn't have to
                content_desc = content.get("value")
                content_desc = (
                    content_desc.replace("<p align='left'>", "")
                    .replace('<p align="left">', "")
                    .replace("</p>", "")
                    .replace("face='Averia Serif'", "")
                    .replace('face="Averia Serif"', "")
                    .replace("size='20'", "")
                    .replace('size="20"', "")
                    .replace("size='21'", "")
                    .replace('size="21"', "")
                    .replace("size='30'", "")
                    .replace('size="30"', "")
                    .replace(
                        "<font color='a8a8a8'  >You may choose from:</font><br>", ""
                    )
                    .replace(
                        "<font color='a8a8a8'  >Click on this node again to allocate it, granting:</font><br>",
                        "",
                    )
                    .replace(
                        "<br><br><font color='a8a8a8'  >Click on a node to view its properties.</font>",
                        "",
                    )
                )
                if content_desc.endswith("."):
                    content_desc = content_desc[:-1]

                # Split UUID for aspect, cluster and node values
                uuid_tokens = uuid.split("_")

                aspect = uuid_tokens[3]

                cluster = uuid_tokens[4]
                if cluster.startswith("The"):
                    cluster = "The " + cluster[3:]
                ascension_attr = uuid_tokens[5]
                ascension_node = ""

                # There are some weird nodes in the localization formatted, for example, AMER_UI_Ascension_Force_TheFalcon_Node_Node_0.0
                if ascension_attr.startswith("Node"):
                    if len(uuid_tokens) > 7 and "Node" in uuid_tokens[6]:
                        continue
                    else:
                        ascension_node = " " + uuid_tokens[6]

                # print(cluster, "\n", ascension_attr, ascension_node, "\n\n")
                cur.execute(
                    "INSERT INTO core (href, aspect, cluster, attr, description, is_subnode, has_implicit) VALUES (?, ?, ?, ?, ?, ?, ?)",
                    (
                        content_href.strip(),
                        aspect.strip(),
                        cluster.strip(),
                        (ascension_attr + ascension_node).strip(),
                        content_desc.strip(),
                        1 if "." in ascension_node else 0,
                        1 if "Gain:" in content_desc else 0,
                    ),
                )
                conn.commit()


def parse_for_corrections():
    """
    Parses a copy of Epic_Encounters_Core/Story/RawFiles/Goals/AMER_GLO_UI_Ascension_NodeRewards_Definitions.txt to determine which node UUIDs are actually used.
    This is used to correlate with the descriptions parsed above to select for the correct node descriptions to use.
    """

    if not os.path.isfile(NODE_REWARDS_FILE):
        raise ("ERROR: The node rewards file was not found.")

    main_node_prefixes = ["PROC_AMER_UI_ElementChain_Node_Link_Add"]

    sub_node_prefixes = [
        "DB_AMER_UI_Ascension_Node_Reward_SpecialLogic",
        "DB_AMER_UI_Ascension_Node_Reward_FlexStat",
        "DB_AMER_UI_Ascension_Node_Reward_ExtendedStat",
        "DB_AMER_UI_Ascension_Node_Reward_StatusMod_FlexStat",
        "DB_AMER_UI_Ascension_Node_Reward_StatusMod_ExtendedStat",
        "DB_AMER_UI_Ascension_Node_Reward_Keyword",
        "DB_AMER_UI_Ascension_Node_Reward_ScalingStat_StatusMod_ExtendedStat",
        "DB_AMER_UI_Ascension_Node_Reward_ScalingStat_StatusMod_FlexStat",
        "PROC_AMER_UI_Ascension_Node_AddReward_FromReal",
    ]

    cur.execute(
        """
        CREATE TEMP TABLE node_rewards (
            aspect TEXT NOT NULL,
            cluster TEXT NOT NULL,
            node TEXT NOT NULL,

            PRIMARY KEY (aspect, cluster, node)
        )
        """
    )
    conn.commit()

    with open(NODE_REWARDS_FILE, "r") as f:
        for line in f:
            if any(line.startswith(prefix) for prefix in main_node_prefixes):
                """
                Check if the line is one that is adding the graph links between nodes
                This is what we use for ground truth for main node descriptions
                """

                """ The tokens are in the form [uuid_prefix, ascension_uuid, from_node, to_node] """
                tokens = line[line.index("(") + 1 : -3].split(",")

                aspect = tokens[1].split("_")[0].replace('"', "")

                cluster = tokens[1].split("_")[1].replace('"', "")
                if cluster.startswith("The"):
                    cluster = "The " + cluster[3:]

                from_node = " ".join(tokens[2].split("_")).replace('"', "")
                to_node = " ".join(tokens[3].split("_")).replace('"', "")

                # print(cluster, from_node, to_node)
                cur.executemany(
                    """
                    INSERT OR IGNORE INTO node_rewards (aspect, cluster, node) VALUES (?, ?, ?)
                    """,
                    [
                        (
                            aspect.strip(),
                            cluster.strip(),
                            from_node.strip(),
                        ),
                        (aspect.strip(), cluster.strip(), to_node.strip()),
                    ],
                )
                conn.commit()

            elif any(line.startswith(prefix) for prefix in sub_node_prefixes):
                """
                Check if the line is one that is giving a character stats or ascension effects.
                These lines are what we use for ground truth for node descriptions.
                """

                """ The tokens are in the form [ascension_uuid, node, ...] """
                tokens = line[line.index("(") + 1 : -3].split(",")

                aspect = tokens[0].split("_")[0].replace('"', "")

                cluster = tokens[0].split("_")[1].replace('"', "")
                if cluster.startswith("The"):
                    cluster = "The " + cluster[3:]

                node_uuid_used = " ".join(tokens[1].split("_")).replace('"', "")

                # print(cluster, node_uuid_used)
                cur.execute(
                    """
                    INSERT OR IGNORE INTO node_rewards (aspect, cluster, node) VALUES (?, ?, ?)
                    """,
                    (
                        aspect.strip(),
                        cluster.strip(),
                        node_uuid_used.strip(),
                    ),
                )
                conn.commit()


def create_final_table():
    cur.execute("DROP TABLE IF EXISTS nodes")
    conn.commit()

    cur.execute(
        """
        CREATE TEMP TABLE tmp_nodes AS
            WITH
            node_descs AS (
                SELECT
                    c.aspect AS aspect,
                    nr.cluster AS cluster, 
                    c.attr AS attr, 
                    c.description AS description,
                    c.is_subnode as is_subnode,
                    c.has_implicit as has_implicit
                FROM node_rewards AS nr
                JOIN core AS c
                ON nr.cluster=c.cluster AND nr.node=c.attr
            ),
            asc_meta AS (
                SELECT
                    aspect,
                    cluster,
                    attr,
                    description,
                    NULL,
                    NULL
                FROM core
                WHERE attr="Title" OR attr="Desc" OR attr="Rewards"
            )
            SELECT * FROM node_descs
            UNION ALL
            SELECT * FROM asc_meta
        """
    )
    conn.commit()

    cur.execute(
        """
        CREATE TABLE nodes (
            aspect TEXT NOT NULL,
            cluster TEXT NOT NULL,
            attr TEXT NOT NULL,
            description TEXT NOT NULL,
            is_subnode INTEGER,
            has_implicit INTEGER,

            PRIMARY KEY (aspect, cluster, attr)
        )
        """
    )
    conn.commit()

    cur.execute("INSERT INTO nodes SELECT * FROM tmp_nodes")
    conn.commit()


def parse_derpys_changes():
    """
    Parses a copy of Derpy's EE2 tweaks/Story/RawFiles/Lua/PipsFancyUIStuff.lua to extract out the changes from Derpy's mod.
    """
    if not os.path.isfile(DERPYS_CHANGES_FILE):
        raise ("ERROR: File containing Derpy's changes was not found.")

    prefixes = ["StatsTab.AddNodeStat", "StatsTab.STATS"]

    cur.execute("DROP TABLE IF EXISTS derpys")
    conn.commit()
    cur.execute(
        """
        CREATE TABLE derpys (
            aspect TEXT NOT NULL,
            cluster TEXT NOT NULL,
            node TEXT NOT NULL,
            description TEXT NOT NULL,

            PRIMARY KEY (aspect, cluster, node)
        )
        """
    )
    conn.commit()

    PARSE_STATE = None
    STATE_PARSING_ADDITIONS = "PARSING_ADDITIONS"
    STATE_NONE = None

    with open(DERPYS_CHANGES_FILE, "r") as f:
        for line in f:
            if line.startswith(prefixes[0]):
                """
                Derpy has some modifications that either add an entirely new node or add an extra effect to a node.
                This contrasts the other modifications where it is a wholesale replacement of the function of the node, so these have to be handled a bit differently during parsing.
                """

                """
                We grab pertinent information from the current line;
                it should be all of the meta information about the modification such as the aspect it belongs to and the node its adding/modifying.
                """
                tokens = (
                    (
                        line[line.index("(") + 1 :]
                        .replace('"', "")
                        .replace("(", "")
                        .replace("{", "")
                        .replace("}", "")
                    )
                    .strip()
                    .split(",")
                )

                aspect = tokens[0].split("_")[0]

                cluster = tokens[0].split("_")[1]
                if cluster.startswith("The"):
                    cluster = "The " + cluster[3:]

                main_node = tokens[1].strip()
                sub_node = tokens[2].strip()

                # print(cluster, main_node, sub_node)
                PARSE_STATE = STATE_PARSING_ADDITIONS

            elif PARSE_STATE == STATE_PARSING_ADDITIONS:
                """ 
                and grab the first instance of a line that contains a description after we found a line that is adding/creating a new node.
                The line should look like this (note the indentation):
                    Description = "...",
                """

                if line.strip().startswith("Description"):
                    tokens = line.split("=")

                    description = tokens[1].replace('"', "")
                    for keyword in EE_KEY_WORDS:
                        description = description.replace(
                            keyword, f'<font color="ebc808">{keyword}</font>'
                        )
                    description = description.replace(
                        "<br><br>", '<br><font color="cb9780">&gt;</font> '
                    )

                    # Scuse the writing-proper-code abuse
                    cur.execute(
                        """
                        INSERT INTO derpys (aspect, cluster, node, description) VALUES (?, ?, ?, ?)
                        """,
                        (
                            aspect.strip(),
                            cluster.strip(),
                            "Node " + main_node + "." + sub_node,
                            '<font color="cb9780">&gt;</font> ' + description.strip(),
                        ),
                    )
                    conn.commit()
                    PARSE_STATE = STATE_NONE

            elif line.startswith(prefixes[1]):
                """
                This handles changes that are total replacements.
                """

                """
                An example of a line we are trying to tokenize is:
                StatsTab.STATS["Form_Wealth_Node_3.1"].Description = "..."
                """
                tokens = line.split("=")
                if tokens[0].strip().endswith("Description"):
                    description = tokens[1].replace('"', "")
                    for keyword in EE_KEY_WORDS:
                        description = description.replace(
                            keyword, f'<font color="ebc808">{keyword}</font>'
                        )
                    description = description.replace(
                        "<br><br>", '<br><font color="cb9780">&gt;</font> '
                    )

                    tokens = tokens[0].split('"')[1].split("_")

                    ascenion_name = tokens[0]

                    cluster = tokens[1]
                    if cluster.startswith("The"):
                        cluster = "The " + cluster[3:]
                    node = tokens[2] + " " + tokens[3]

                    cur.execute(
                        """
                        INSERT INTO derpys (aspect, cluster, node, description) VALUES (?, ?, ?, ?)
                        """,
                        (
                            ascenion_name.strip(),
                            cluster.strip(),
                            node.strip(),
                            '<font color="cb9780">&gt;</font> ' + description.strip(),
                        ),
                    )
                    conn.commit()


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--with-overwrite",
        help="Allows the file to automatically copy the final database over to the website and overwrite an existing one there.",
        action="store_true",
    )

    args = parser.parse_args()
    print(args)

    print("Sanitizing localization file")
    clean_bad_chars()

    print("Parsing for descriptions")
    parse_for_descriptions()

    print("Parsing for corrections")
    parse_for_corrections()

    print("Creating final ground truth table")
    create_final_table()

    print("Parsing for Derpy's changes")
    parse_derpys_changes()

    conn.close()

    if args.with_overwrite:
        print("-- OVERWRITING DATABASE FILE --")
        shutil.move(DB_NAME, os.path.join(ORM_DIR, DB_NAME))
