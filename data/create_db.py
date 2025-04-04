from bs4 import BeautifulSoup
import sqlite3
import os
import shutil

EE_CORE_ROOT = (
    "../EE2_raw_src/Core/Mods/Epic_Encounters_Core_63bb9b65-2964-4c10-be5b-55a63ec02fa0"
)
DERPY_ROOT = "../EE2_raw_src/Derpy's/Mods/Derpy's EE2 tweaks"
DB_NAME = "ascensions.db"
ORM_DIR = "../client/prisma"

if not os.path.isdir(EE_CORE_ROOT):
    raise ("ERROR: Path to folder containing unpacking of EE Core was not found.")
if not os.path.isdir(DERPY_ROOT):
    raise ("ERROR: Path to foldering containg unpacking of Derpy's mod was not found.")
if not os.path.isdir(ORM_DIR):
    raise ("ERROR: The website's ORM folder was not found.")


conn = sqlite3.connect(DB_NAME)
cur = conn.cursor()


def parse_for_descriptions():
    """
    Parses Epic_Encounters_Core/Localization/AMER_UI_Ascension.lsx to extract out the node descriptions for all ascensions.
    There are unused and duplicate descriptions which are not handled in this function; they are handled later.
    """

    file = os.path.join(EE_CORE_ROOT, "Localization/AMER_UI_Ascension.lsx")

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

            PRIMARY KEY (aspect, cluster, attr)
        )
        """
    )
    conn.commit()

    with open(file, "r") as f:
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

        soup = BeautifulSoup(f.read(), "lxml")
        tl_nodes = soup.find_all(id="TranslatedStringKey")

        for node in tl_nodes:
            content = node.find("attribute", id="Content")
            content_href = content.get("handle")
            content_text = content.get("value")

            uuid = node.find("attribute", id="UUID").get("value")

            if any(uuid.startswith(prefix) for prefix in ascension_prefixes):
                uuid_tokens = uuid.split("_")

                aspect = uuid_tokens[3]

                cluster = uuid_tokens[4]
                if cluster.startswith("The"):
                    cluster = "The " + cluster[3:]
                ascension_attr = uuid_tokens[5]
                ascension_node = ""

                if ascension_attr.startswith("Node"):
                    # There are some weird nodes in the localization formatted, for example, AMER_UI_Ascension_Force_TheFalcon_Node_Node_0.0
                    if len(uuid_tokens) > 7 and "Node" in uuid_tokens[6]:
                        continue
                    else:
                        ascension_node = " " + uuid_tokens[6]

                # print(cluster, "\n", ascension_attr, ascension_node, "\n\n")
                cur.execute(
                    "INSERT INTO core (href, aspect, cluster, attr, description, is_subnode) VALUES (?, ?, ?, ?, ?, ?)",
                    (
                        content_href.strip(),
                        aspect.strip(),
                        cluster.strip(),
                        (ascension_attr + ascension_node).strip(),
                        content_text.strip(),
                        1 if "." in ascension_node else 0,
                    ),
                )
                conn.commit()


print("Parsing for descriptions")
parse_for_descriptions()


def parse_for_corrections():
    """
    Parses Epic_Encounters_Core/Story/RawFiles/Goals/AMER_GLO_UI_Ascension_NodeRewards_Definitions.txt to determine which node UUIDs are actually used.
    This is used to correlate with the descriptions parsed above to select for the correct node descriptions to use.
    """

    file = os.path.join(
        EE_CORE_ROOT,
        "Story/RawFiles/Goals/AMER_GLO_UI_Ascension_NodeRewards_Definitions.txt",
    )

    main_node_prefixes = ["PROC_AMER_UI_ElementChain_Node_Link_Add"]

    sub_node_prefixes = [
        "DB_AMER_UI_Ascension_Node_Reward_SpecialLogic",
        "DB_AMER_UI_Ascension_Node_Reward_FlexStat",
        "DB_AMER_UI_Ascension_Node_Reward_ExtendedStat",
        "DB_AMER_UI_Ascension_Node_Reward_StatusMod_FlexStat",
        "DB_AMER_UI_Ascension_Node_Reward_StatusMod_ExtendedStat",
        "DB_AMER_UI_Ascension_Node_Reward_Keyword",
        "DB_AMER_UI_Ascension_Node_Reward_ScalingStat_StatusMod_ExtendedStat",
        "DB_AMER_UI_Ascension_Node_Reward_ScalingStat_StatusMod_FlexStat"
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

    with open(file, "r") as f:
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


print("Parsing for corrections")
parse_for_corrections()


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
                    c.is_subnode as is_subnode
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

            PRIMARY KEY (aspect, cluster, attr)
        )
        """
    )
    conn.commit()

    cur.execute("INSERT INTO nodes SELECT * FROM tmp_nodes")
    conn.commit()


print("Creating final ground truth table")
create_final_table()


def parse_derpys_changes():
    """
    Parses Derpy's/Mods/Derpy's EE2 tweaks/Story/RawFiles/Lua/PipsFancyUIStuff.lua to extract out the changes from Derpy's mod.
    """
    file = os.path.join(DERPY_ROOT, "Story/RawFiles/Lua/PipsFancyUIStuff.lua")

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

    with open(file, "r") as f:
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

                    # Scuse the writing-proper-code abuse
                    cur.execute(
                        """
                        INSERT INTO derpys (aspect, cluster, node, description) VALUES (?, ?, ?, ?)
                        """,
                        (
                            aspect.strip(),
                            cluster.strip(),
                            "Node " + main_node + "." + sub_node,
                            description.strip(),
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
                            description.strip(),
                        ),
                    )
                    conn.commit()


print("Parsing for Derpy's changes")
parse_derpys_changes()

conn.close()

shutil.move(DB_NAME, os.path.join(ORM_DIR, DB_NAME))
