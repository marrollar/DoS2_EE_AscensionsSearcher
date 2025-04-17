import os

import bs4
from bs4 import BeautifulSoup
from constants import (
    AMER_LOCAL_PREFIXES,
    AMER_NODE_REWARDS_PREFIX,
    AMER_SUBNODE_REWARDS_PREFIXES,
    DERPYS_CHANGES_FILE,
    DERPYS_LUAFILE_PREFIXES,
    MODIFIED_DERPYS_LOCAL,
    MODIFIED_EE_LOCAL,
    NODE_REWARDS_FILE,
)
from parse_helpers import (
    CoreHelper,
    DerpysAdditionsHelper,
    DerpysReplacementsHelper,
    NodeRewardsHelper,
    descs_are_same,
)
from sql import (
    CREATE_TABLE_CORE,
    CREATE_TABLE_DERPYS,
    CREATE_TABLE_NODE_REWARDS,
    CREATE_TABLE_NODES,
    INSERT_TABLE_CORE,
    INSERT_TABLE_DERPYS,
    INSERT_TABLE_NODE_REWARDS,
    t_CORE,
    t_DERPYS,
    t_NODES,
)
from sql import (
    t_NODE_REWARDS as t_NR,
)
from tqdm import tqdm


def parse_for_descriptions(cur, conn, TEMP_INTERMEDIATE_TABLES=True):
    """
    Parses a character sanitized version of Epic_Encounters_Core/Localization/AMER_UI_Ascension.lsx to extract out the node descriptions for all ascensions.
    There are unused and duplicate descriptions which are not handled in this function; they are handled later.
    """
    if not os.path.isfile(MODIFIED_EE_LOCAL):
        raise (
            "ERROR: Somehow, modifications to the localization file "
            "didnt manage to get saved, "
            "or something really bad happened to it somewhere."
        )

    CREATE_TABLE_CORE(cur, conn, temp=TEMP_INTERMEDIATE_TABLES)

    with open(MODIFIED_EE_LOCAL, "r") as f:
        """
        This is an example of an entry we are attempting to parse:

        <node id="TranslatedStringKey">
            <attribute id="Content" type="28" handle="h81742daeg1cbfg4f08gb4b2gf93b7970bc6d" value="&lt;p align='left'&gt;&lt;font color='a8a8a8' size='21' face='Averia Serif'&gt;Click on this node again to allocate it, granting:&lt;/font&gt;&lt;br&gt;&lt;font color='cb9780'&gt;»&lt;/font&gt; +5% Fire Resistance.&lt;/p&gt;" />
            <attribute id="ExtraData" type="23" value="" />
            <attribute id="Speaker" type="22" value="" />
            <attribute id="Stub" type="19" value="True" />
            <attribute id="UUID" type="22" value="AMER_UI_Ascension_Force_TheHatchet_Node_0.1" />
        </node>

        We want description from "Content" and aspect, cluster, node from "UUID".
        We also store "handle" from "Content" to correlate with Derpy's changes later.
        """

        soup = BeautifulSoup(f.read(), "xml")
        tl_nodes = soup.find_all(id="TranslatedStringKey")

        for node in tqdm(tl_nodes, desc="Parsing for descriptions"):
            uuid = node.find("attribute", id="UUID").get("value")

            if any(uuid.startswith(prefix) for prefix in AMER_LOCAL_PREFIXES):
                content = node.find("attribute", id="Content")
                content_href = content.get("handle")

                core_helper = CoreHelper(content.get("value"), uuid)
                content_desc = core_helper.desc
                aspect, cluster, cluster_attr, node = core_helper.cluster_data

                if aspect is None:
                    continue

                if "Desc" in cluster_attr:
                    node = ""

                # print(cluster, "\n", ascension_attr, ascension_node, "\n\n")
                INSERT_TABLE_CORE(
                    cur,
                    conn,
                    (t_CORE.href, content_href),
                    (t_CORE.aspect, aspect),
                    (t_CORE.cluster, cluster),
                    (t_CORE.attr, f"{cluster_attr} {node}"),
                    (t_CORE.description, content_desc),
                    (t_CORE.is_subnode, 1 if "." in node else 0),
                    (t_CORE.has_implicit, 1 if "Gain:" in content_desc else 0),
                )


def parse_for_corrections(cur, conn, TEMP_INTERMEDIATE_TABLES=True):
    """
    Parses a copy of Epic_Encounters_Core/Story/RawFiles/Goals/AMER_GLO_UI_Ascension_NodeRewards_Definitions.txt to determine which node UUIDs are actually used.
    This is used to correlate with the descriptions parsed above to select for the correct node descriptions to use.
    """

    if not os.path.isfile(NODE_REWARDS_FILE):
        raise "ERROR: The node rewards file was not found."

    CREATE_TABLE_NODE_REWARDS(cur, conn, temp=TEMP_INTERMEDIATE_TABLES)

    with open(NODE_REWARDS_FILE, "r") as f:
        for line in tqdm(f, desc="Parsing for corrections"):
            if any(line.startswith(prefix) for prefix in AMER_NODE_REWARDS_PREFIX):
                """
                Check if the line is one that is adding the graph links between nodes
                This is what we use for ground truth for main node descriptions
                """

                """ The tokens are in the form [uuid_prefix, ascension_uuid, from_node, to_node] """
                nr_helper = NodeRewardsHelper(line)
                aspect, cluster, from_node, to_node = nr_helper.from_graph_link()

                # print(cluster, from_node, to_node)
                INSERT_TABLE_NODE_REWARDS(
                    cur,
                    conn,
                    (t_NR.aspect, aspect),
                    (t_NR.cluster, cluster),
                    (t_NR.node, from_node),
                )
                INSERT_TABLE_NODE_REWARDS(
                    cur,
                    conn,
                    (t_NR.aspect, aspect),
                    (t_NR.cluster, cluster),
                    (t_NR.node, to_node),
                )

            elif any(
                    line.startswith(prefix) for prefix in AMER_SUBNODE_REWARDS_PREFIXES
            ):
                """
                Check if the line is one that is giving a character stats or ascension effects.
                These lines are what we use for ground truth for node descriptions.
                """

                """ The tokens are in the form [ascension_uuid, node, ...] """
                nr_helper = NodeRewardsHelper(line)
                aspect, cluster, node = nr_helper.from_reward()

                # print(cluster, node_uuid_used)
                INSERT_TABLE_NODE_REWARDS(
                    cur,
                    conn,
                    (t_NR.aspect, aspect),
                    (t_NR.cluster, cluster),
                    (t_NR.node, node),
                )


def create_final_table(cur, conn):
    tqdm.write("Creating final ground truth table")
    CREATE_TABLE_NODES(cur, conn, temp=False)

    cur.execute("DROP TABLE IF EXISTS tmp_nodes")
    cur.execute(f"""
        CREATE TEMP TABLE tmp_nodes AS
            WITH
            node_descs AS (
                SELECT
                    c.{t_CORE.href} as href,
                    c.{t_CORE.aspect} AS aspect,
                    nr.{t_NR.cluster} AS cluster, 
                    c.{t_CORE.attr} AS attr, 
                    c.{t_CORE.description} AS description,
                    c.{t_CORE.is_subnode} as is_subnode,
                    c.{t_CORE.has_implicit} as has_implicit
                FROM {t_NR._name} AS nr
                JOIN {t_CORE._name} AS c
                ON nr.{t_NR.cluster}=c.{t_CORE.cluster} AND nr.{t_NR.node}=c.{t_CORE.attr}
            ),
            asc_meta AS (
                SELECT
                    {t_CORE.href},
                    {t_CORE.aspect},
                    {t_CORE.cluster},
                    {t_CORE.attr},
                    {t_CORE.description},
                    NULL,
                    NULL
                FROM {t_CORE._name}
                WHERE {t_CORE.attr}="Title" OR {t_CORE.attr}="Desc" OR {t_CORE.attr}="Rewards"
            )
            SELECT * FROM node_descs
            UNION ALL
            SELECT * FROM asc_meta
    """)
    conn.commit()

    cur.execute("INSERT INTO nodes SELECT * FROM tmp_nodes")
    conn.commit()


def parse_derpys_changes(cur, conn):
    """
    Parses a copy of Derpy's EE2 tweaks/Story/RawFiles/Lua/PipsFancyUIStuff.lua to extract out the changes from Derpy's mod.
    """
    if not os.path.isfile(DERPYS_CHANGES_FILE):
        raise "ERROR: File containing Derpy's changes was not found."

    CREATE_TABLE_DERPYS(cur, conn, temp=False)

    STATE_PARSING_ADDITIONS = "PARSING_ADDITIONS"
    STATE_NONE = None
    PARSE_STATE = STATE_NONE

    with open(DERPYS_CHANGES_FILE, "r") as f:
        for line in tqdm(f, desc="Parsing for Derpy's changes"):
            line = line.strip()
            if line.startswith(DERPYS_LUAFILE_PREFIXES[0]):
                """
                Derpy has some modifications that either add an entirely new node or add an extra effect to a node.
                This contrasts the other modifications where it is a wholesale replacement of the function of the node, 
                so these have to be handled a bit differently during parsing.

                We grab pertinent information from the current line;
                it should be all of the meta information about the modification such as the aspect it belongs to and 
                the node its adding/modifying.
                
                The line looks like this:
                StatsTab.AddNodeStat("Inertia_TheRhinoceros", 3, 2, "Centurion", "Mutator", {
                """
                metaline = line

                PARSE_STATE = STATE_PARSING_ADDITIONS

            elif PARSE_STATE == STATE_PARSING_ADDITIONS:
                """ 
                and grab the first instance of a line that contains a description after we found a line that is adding/creating a new node.
                The line should look like this (note the indentation):
                    Description = "...",
                """
                if line.startswith("Description"):
                    derpys_additions_helper = DerpysAdditionsHelper(metaline, line)

                    aspect, cluster, node = derpys_additions_helper.cluster_data
                    description = derpys_additions_helper.desc

                    INSERT_TABLE_DERPYS(
                        cur,
                        conn,
                        (t_DERPYS.aspect, aspect),
                        (t_DERPYS.cluster, cluster),
                        (t_DERPYS.node, node),
                        (t_DERPYS.description, description),
                        (t_DERPYS.is_addition, 1),
                    )
                    PARSE_STATE = STATE_NONE

            elif line.startswith(DERPYS_LUAFILE_PREFIXES[1]):
                """
                This handles changes that are total replacements.
                """

                """
                An example of a line we are trying to tokenize is:
                StatsTab.STATS["Form_Wealth_Node_3.1"].Description = "..."
                """
                tokens = line.split("=")
                if tokens[0].strip().endswith("Description"):
                    derpys_replacements_helper = DerpysReplacementsHelper(
                        tokens[0], tokens[1]
                    )
                    aspect, cluster, node = derpys_replacements_helper.cluster_data
                    description = derpys_replacements_helper.desc

                    INSERT_TABLE_DERPYS(
                        cur,
                        conn,
                        (t_DERPYS.aspect, aspect),
                        (t_DERPYS.cluster, cluster),
                        (t_DERPYS.node, node),
                        (t_DERPYS.description, description),
                        (t_DERPYS.is_addition, 0),
                    )


def rectify_edge_cases(cur, conn):
    """
    There are 3 edge cases that need to be resolved.

    Derpys changes that are additions are one of either:
    1. A completely new node. (See Rhinoceros 3.2 from Derpys)
    2. An added effect to a node. (See Extinction 2.2 from Derpys)

    3. Derpy has some changes that do not exist in the lua file that is being parsed.
    These changes typically correspond to effects that grant a Talent on some condition (See Serpent 2.1)
    """

    """
    1. is fixed implicitly during the parsing of Derpy's lua file.
    
    In order to fix 2., we will use the 'is_additions' column in the 'derpys' table as a filter for any 
    modification we assume is an addition to a cluster.
    
    We then check the modification's Node.Subnode against the 'nodes' table.
    If the 'nodes' table already has such a node, we assume it is an added effect.
    If such a node does not exist, we assume it is a new node entirely.
    """
    tqdm.write("Fixing edge cases")

    # 1. Get every entry in the 'derpys' table that is considered an addition.
    derpy_additions = cur.execute(f"""
        SELECT 
            {t_DERPYS.cluster}, 
            {t_DERPYS.node},
            {t_DERPYS.description}
        FROM {t_DERPYS._name} WHERE {t_DERPYS.is_addition}=1
    """).fetchall()

    # 2. Get every entry in the 'nodes' table that corresponds is the same (cluster, node) pair
    for cluster, node, desc in derpy_additions:
        nodes_entry = cur.execute(f"""
            SELECT
                {t_NODES.cluster},
                {t_NODES.attr},
                {t_NODES.description}
            FROM {t_NODES._name}
            WHERE
                {t_NODES.cluster}=? AND
                {t_NODES.attr}=?
        """, (
            cluster,
            node
        )).fetchall()

        # 2.1 If such an entry exists
        if len(nodes_entry) > 0:
            assert len(nodes_entry) == 1
            existing_desc = nodes_entry[0][2]

            # 3. Update the 'derpys' description to also have the original description in front of Derpy's description.
            cur.execute(f"""
                UPDATE {t_DERPYS._name}
                SET {t_DERPYS.description}=?
                WHERE
                    {t_DERPYS.cluster}=? AND
                    {t_DERPYS.node}=?
            """, (
                f"{existing_desc}<br>{desc}",
                cluster,
                node
            ))
            conn.commit()

        """
        In order to fix 3. we will parse Derpy's localization file - english.xml - 
        to retrieve all 'contentuid's being overwritten.
        
        We then to need to check:
        1. Whether this contentuid exists in the 'nodes' table so we filter out all non-ascensions related text.
        2. If it does, we treat it as a replacement of the node in question.
        
        Alot of this work is admittedly wasteful, but to avoid having to rewrite a big portion of the database related code,
        we can just reuse the database structure created earlier anyway.
        """

        with open(MODIFIED_DERPYS_LOCAL, "r") as f:
            soup = bs4.BeautifulSoup(f, "xml")
            content_tags = soup.find_all("content")

            # 1. Get all tags in the 'english.xml' file
            for tag in content_tags:
                content_id = tag.get("contentuid")

                # 2. Get the entry in 'nodes' that corresponds with the current tag
                node_data = cur.execute(f"""
                    SELECT * FROM {t_NODES._name}
                    WHERE {t_NODES.href}=?
                """, (content_id,)).fetchall()

                # 2.1 If such an entry exists
                if len(node_data) > 0:
                    assert len(node_data) == 1
                    node_data = node_data[0]

                    # 3. Ignore main node descriptions. We never use them, but they are stored for posterity.
                    if "." not in node_data[3]:
                        continue

                    aspect, cluster, node, desc = (
                        node_data[1],
                        node_data[2],
                        node_data[3],
                        node_data[4],
                    )
                    derpys_local_text = CoreHelper.sanitize_description(tag.text)

                    raw_desc = BeautifulSoup(desc, "html.parser").get_text()
                    raw_derpys_local_text = BeautifulSoup(
                        derpys_local_text, "html.parser"
                    ).get_text()

                    if not descs_are_same(
                            raw_desc, raw_derpys_local_text, threshold=0.95
                    ):
                        cur.execute(f"""
                            INSERT INTO {t_DERPYS._name} ({t_DERPYS.aspect}, {t_DERPYS.cluster}, {t_DERPYS.node}, {t_DERPYS.description}, {t_DERPYS.is_addition})
                            VALUES (?,?,?,?,?)
                            ON CONFLICT({t_DERPYS.aspect}, {t_DERPYS.cluster}, {t_DERPYS.node}) DO UPDATE SET
                                {t_DERPYS.description}=?
                        """, (
                            aspect,
                            cluster,
                            node,
                            derpys_local_text,
                            0,
                            derpys_local_text,
                        ))
                        conn.commit()
