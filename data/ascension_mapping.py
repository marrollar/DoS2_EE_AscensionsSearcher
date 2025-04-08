import xml.etree.ElementTree as ET
import re

def map_id_to_ascension():
# Load and parse english.xml
    EE_CORE_ROOT = (
        "../EE2_raw_src/Core/Mods/Epic_Encounters_Core_63bb9b65-2964-4c10-be5b-55a63ec02fa0"
    )
    # Load and parse AMER_UI_Ascension.lsx
    lsx_tree = ET.parse(f'{EE_CORE_ROOT}/Localization/AMER_UI_Ascension.lsx')
    lsx_root = lsx_tree.getroot()

    # Build the mapping
    contentuid_to_uuid = {}

    for node in lsx_root.iter('node'):
        uuid = None
        content_handle = None

        for attr in node.iter('attribute'):
            if attr.attrib.get('id') == 'UUID':
                uuid = attr.attrib.get('value')
            elif attr.attrib.get('id') == 'Content':
                content_handle = attr.attrib.get('handle')

        if uuid and content_handle and re.search(r'Node_[0-9]\.[0-9]$', uuid):
            contentuid_to_uuid[content_handle] = uuid

    # Resulting dictionary
    return contentuid_to_uuid

def map_node_number_to_ascension():
    NODE_REWARDS_FILE = "AMER_GLO_UI_Ascension_NodeRewards_Definitions.txt"
    pattern = re.compile(r'"[^"]+",\s*"([^"]+)",\s*"Node_(\d+)"')
    node_map = {}
    with open(NODE_REWARDS_FILE, 'r') as f:
        for line in f:
            if "AddNode_Child" not in line:
                continue
            match = pattern.search(line)
            if match:
                cluster_full_name, node_number = match.groups()
                cluster_name = cluster_full_name.split("_")[1]
                if not node_map.get(cluster_name) or node_map[cluster_name] < int(node_number) + 1:
                    node_map[cluster_name] = int(node_number) + 1
    return node_map

