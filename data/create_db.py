from bs4 import BeautifulSoup
import sqlite3
import os

ee_core_root = (
    "../EE2_raw_src/Core/Mods/Epic_Encounters_Core_63bb9b65-2964-4c10-be5b-55a63ec02fa0"
)

conn = sqlite3.connect("ascensions.db")
cur = conn.cursor()


def parse_for_descriptions():
    """
    Parses Epic_Encounters_Core/Localization/AMER_UI_Ascension.lsx to extract out the node descriptions for all ascensions.
    There are unused and duplicate descriptions which are not handled in this function; they are handled later.
    """

    file = os.path.join(ee_core_root, "Localization/AMER_UI_Ascension.lsx")

    ascension_prefixes = [
        "AMER_UI_Ascension_Force_",
        "AMER_UI_Ascension_Entropy_",
        "AMER_UI_Ascension_Form_",
        "AMER_UI_Ascension_Inertia_",
        "AMER_UI_Ascension_Life_",
    ]

    cur.execute("DROP TABLE IF EXISTS core")
    cur.execute(
        """
        CREATE TABLE core (
            href TEXT PRIMARY KEY,
            ascension TEXT,
            aspect TEXT,
            attr TEXT,
            description TEXT,
            is_subnode INTEGER
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
        The ascension, aspect and node is extracted from UUID.
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

                ascension_name = uuid_tokens[3]

                aspect_name = uuid_tokens[4]
                if aspect_name.startswith("The"):
                    aspect_name = "The " + aspect_name[3:]
                ascension_attr = uuid_tokens[5]
                ascension_node = ""

                if ascension_attr.startswith("Node"):
                    ascension_node = uuid_tokens[6]

                # print(aspect_name, "\n", ascension_attr, ascension_node, "\n\n")
                cur.execute(
                    "INSERT INTO core (href, ascension, aspect, attr, description, is_subnode) VALUES (?, ?, ?, ?, ?, ?)",
                    (
                        content_href.strip(),
                        ascension_name.strip(),
                        aspect_name.strip(),
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
        ee_core_root,
        "Story/RawFiles/Goals/AMER_GLO_UI_Ascension_NodeRewards_Definitions.txt",
    )

    main_node_prefixes = ["PROC_AMER_UI_ElementChain_Node_Link_Add"]

    sub_node_prefixes = [
        "DB_AMER_UI_Ascension_Node_Reward_SpecialLogic",
        "DB_AMER_UI_Ascension_Node_Reward_FlexStat",
        "DB_AMER_UI_Ascension_Node_Reward_ExtendedStat",
    ]

    cur.execute("DROP TABLE IF EXISTS node_rewards")
    cur.execute(
        """
        CREATE TABLE node_rewards (
            ascension TEXT,
            aspect TEXT,
            node TEXT,
            PRIMARY KEY (ascension, node)
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

                ascension_name = tokens[1].split("_")[0].replace('"', "")

                aspect_name = tokens[1].split("_")[1].replace('"', "")
                if aspect_name.startswith("The"):
                    aspect_name = "The " + aspect_name[3:]

                from_node = "".join(tokens[2].split("_")).replace('"', "")
                to_node = "".join(tokens[3].split("_")).replace('"', "")

                # print(aspect_name, from_node, to_node)
                cur.executemany(
                    """
                    INSERT OR IGNORE INTO node_rewards (ascension, aspect, node) VALUES (?, ?, ?)
                    """,
                    [
                        (ascension_name.strip(), aspect_name.strip(), from_node.strip()),
                        (ascension_name.strip(), aspect_name.strip(), to_node.strip()),
                    ],
                )
                conn.commit()

            elif any(line.startswith(prefix) for prefix in sub_node_prefixes):
                """
                Check if the line is one that is changing character properties, IE giving them stats and ascension effects.
                This is what we use for ground truth for sub node descriptions
                """

                """ The tokens are in the form [ascension_uuid, node, ...] """
                tokens = line[line.index("(") + 1 : -3].split(",")

                ascension_name = tokens[0].split("_")[0].replace('"', "")

                aspect_name = tokens[0].split("_")[1].replace('"', "")
                if aspect_name.startswith("The"):
                    aspect_name = "The " + aspect_name[3:]

                node_uuid_used = "".join(tokens[1].split("_")).replace('"', "")

                # print(aspect_name, node_uuid_used)
                cur.execute(
                    """
                    INSERT OR IGNORE INTO node_rewards (ascension, aspect, node) VALUES (?, ?, ?)
                    """,
                    (ascension_name.strip(), aspect_name.strip(), node_uuid_used.strip()),
                )
                conn.commit()


print("Parsing for corrections")
parse_for_corrections()


def create_final_table():
    cur.execute("DROP TABLE IF EXISTS nodes")
    conn.commit()

    cur.execute(
        """
        CREATE TABLE nodes AS
            WITH
            node_descs AS (
                SELECT
                    c.ascension AS ascension,
                    nr.aspect AS aspect, 
                    c.attr AS attr, 
                    c.description AS description,
                    c.is_subnode as is_subnode
                FROM node_rewards AS nr
                JOIN core AS c
                ON nr.aspect=c.aspect AND nr.node=c.attr
            ),
            asc_meta AS (
                SELECT
                    ascension,
                    aspect,
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


print("Creating final ground truth table")
create_final_table()


def parse_derpys_changes():
    """
    Parses Derpy's/Mods/Derpy's EE2 tweaks/Story/RawFiles/Lua/PipsFancyUIStuff.lua to extract out the changes from Derpy's mod.
    """
    derpy_root = "../EE2_raw_src/Derpy's/Mods/Derpy's EE2 tweaks"
    file = os.path.join(derpy_root, "Story/RawFiles/Lua/PipsFancyUIStuff.lua")

    prefixes = ["StatsTab.AddNodeStat", "StatsTab.STATS"]

    cur.execute("DROP TABLE IF EXISTS derpys")
    conn.commit()
    cur.execute(
        """
        CREATE TABLE derpys (
            ascension TEXT,
            aspect TEXT,
            node TEXT,
            description TEXT
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
                it should be all of the meta information about the modification such as the ascension it belongs to and the node its adding/modifying.
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

                ascension_name = tokens[0].split("_")[0]

                aspect_name = tokens[0].split("_")[1]
                if aspect_name.startswith("The"):
                    aspect_name = "The " + aspect_name[3:]

                main_node = tokens[1].strip()
                sub_node = tokens[2].strip()

                # print(aspect_name, main_node, sub_node)
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
                        INSERT INTO derpys (ascension, aspect, node, description) VALUES (?, ?, ?, ?)
                        """,
                        (
                            ascension_name.strip(),
                            aspect_name.strip(),
                            "Node" + main_node + "." + sub_node,
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

                    aspect_name = tokens[1]
                    if aspect_name.startswith("The"):
                        aspect_name = "The " + aspect_name[3:]
                    node = tokens[2] + tokens[3]

                    cur.execute(
                        """
                        INSERT INTO derpys (ascension, aspect, node, description) VALUES (?, ?, ?, ?)
                        """,
                        (
                            ascenion_name.strip(),
                            aspect_name.strip(),
                            node.strip(),
                            description.strip(),
                        ),
                    )
                    conn.commit()

print("Parsing for Derpy's changes")
parse_derpys_changes()

conn.close()
