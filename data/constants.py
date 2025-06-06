# --------------------- FILES BEING PARSED ---------------------

EE_MODID = "63bb9b65-2964-4c10-be5b-55a63ec02fa0"
EpipE_MODID = "7d32cb52-1cfd-4526-9b84-db4867bf9356"

# This file is found in the unpack of "Epic_Encounters_Core".
# Note that the copy of it in the repo has been renamed, but the contents are not altered.
# The path after unpack is:
# /Mods/Epic_Encounters_Core/Localization/AMER_UI_Ascension.lsx
# ORIGINAL_EE_LOCAL = "raw_files/_ORIGINAL_AMER_UI_Ascension.lsx"
ORIGINAL_EE_LOCAL = f"../unpacks/Core/Mods/Epic_Encounters_Core_{EE_MODID}/Localization/AMER_UI_Ascension.lsx"
MODIFIED_EE_LOCAL = "raw_files/MODIFIED_AMER_UI_Ascension.lsx"

# The path after unpack is:
# /Story/RawFiles/Goals/AMER_GLO_UI_Ascension_NodeRewards_Definitions.txt
# NODE_REWARDS_FILE = "raw_files/_ORIGINAL_AMER_GLO_UI_Ascension_NodeRewards_Definitions.txt"
NODE_REWARDS_FILE = f"../unpacks/Core/Mods/Epic_Encounters_Core_{EE_MODID}/Story/RawFiles/Goals/AMER_GLO_UI_Ascension_NodeRewards_Definitions.txt"

# This file is found in the unpack of "Derpy's EE2 Tweaks".
# The path after unpack is:
# /Mods/Derpy's EE2 tweaks/Story/RawFiles/Lua/PipsFancyUIStuff.lua
# DERPYS_CHANGES_FILE = "raw_files/PipsFancyUIStuff.lua"
DERPYS_CHANGES_FILE = "../unpacks/Derpy's/Mods/Derpy's EE2 tweaks/Story/RawFiles/Lua/PipsFancyUIStuff.lua"

# This file is found in the unpack of "Derpy's EE2 Tweaks"
# The path after unpack is:
# /Mods/Derpy's EE2 tweaks/Localization/English
# ORIGINAL_DERPYS_LOCAL = "raw_files/_ORIGINAL_Derpys_english.xml"
ORIGINAL_DERPYS_LOCAL = "../unpacks/Derpy's/Mods/Derpy's EE2 tweaks/Localization/English/english.xml"
MODIFIED_DERPYS_LOCAL = "raw_files/MODIFIED_Derpys_english.xml"

# This file is found in the unpack of "Epic_Encounters_Core"
# The path after unpack is:
# /Mods/Epic_Encounters_Core/Localization
# ORIGINAL_AMER_ARTIFACTS_NAMES_FILE = "raw_files/_ORIGINAL_AMER_Artifacts.lsx"
ORIGINAL_AMER_ARTIFACTS_NAMES_FILE = f"../unpacks/Core/Mods/Epic_Encounters_Core_{EE_MODID}/Localization/AMER_Artifacts.lsx"
MODIFIED_AMER_ARTIFACTS_NAMES_FILE = "raw_files/MODIFIED_AMER_Artifacts.lsx"

# This file is found in the unpack of Epic_Encounters_core
# AMER_ICONS_IMGS = "raw_files/AMER_Icons_Master.dds"
AMER_ICONS_DDS = f"../unpacks/Core/Public/Epic_Encounters_Core_{EE_MODID}/Assets/Textures/Icons/AMER_Icons_Master.dds"
AMER_ICONS_LSX = f"../unpacks/Core/Public/Epic_Encounters_Core_{EE_MODID}/GUI/AMER_Icons_Master.lsx"

# This file is found in the unpack of "EpipEncounters"
# EPIPS_ARTIFACTS_FILE = "raw_files/Shared.lua"
EPIP_ARTIFACTS_FILE = f"../unpacks/Epip/Mods/EpipEncounters_{EpipE_MODID}/Story/RawFiles/Lua/Utilities/Artifact/Shared.lua"

# This file is found in the unpack of "Epic_Encounters_Core"
EE_ROOT_TEMPLATES = f"../unpacks/Core/Public/Epic_Encounters_Core_{EE_MODID}/RootTemplates/"

# This file is found in the unpack of Epic_Encounters_Core
EE_ARTIFACTS_DESC_FILE = f"../unpacks/Core/Public/Epic_Encounters_Core_{EE_MODID}/Localization/Stats/Status_CONSUME_DisplayName.lsx"

# This file is found in the unpack of "Epic_Encounters_Core"
# The path after unpack is:
# /Public/Epic_Encounters_Core/Localization/Stats
# ORIGINAL_AMER_ARTIFACTS_DESC_FILE = "raw_files/_ORIGINAL_Status_CONSUME_DisplayName.lsx"
# MODIFIED_AMER_ARTIFACTS_DESC_FILE = "raw_files/MODIFIED_Status_CONSUME_DisplayName.lsx"

# TODO: description for these files

# AMER_ARTIFACTS_ICON_REF_FILE = "raw_files/AMERS_Status_CONSUME.txt"
# EPIPS_ARTIFACTS_ICON_REF_FILE = "raw_files/EPIPS_Status_CONSUME.txt"

# --------------------- EE CONSTANTS ---------------------
EE_KEY_WORDS = [
    "Elementalist",
    "Paucity",
    "Predator",
    "Violent Strikes",
    "Violent Strike",
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
    "Voracity",
    "Presence",
    "Volatile Armor"
]

AMER_LOCAL_PREFIXES = [
    "AMER_UI_Ascension_Force_",
    "AMER_UI_Ascension_Entropy_",
    "AMER_UI_Ascension_Form_",
    "AMER_UI_Ascension_Inertia_",
    "AMER_UI_Ascension_Life_",
]

AMER_NODE_REWARDS_PREFIX = ["PROC_AMER_UI_ElementChain_Node_Link_Add"]
AMER_SUBNODE_REWARDS_PREFIXES = [
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

DERPYS_LUAFILE_PREFIXES = ["StatsTab.AddNodeStat", "StatsTab.STATS"]

# --------------------- STRING CONSTANTS ---------------------
HTML_GT = '<font color="cb9780">&gt;</font>'


def HTML_COLOR_KEYWORD(keyword):
    return f'<font color="ebc808">{keyword}</font>'
