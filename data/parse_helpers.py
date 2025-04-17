import os
import string
from difflib import SequenceMatcher

from constants import EE_KEY_WORDS, HTML_COLOR_KEYWORD, HTML_GT

# "tns" for "tokenize and sanitize"

def clean_bad_chars(orig_path, modified_path):
    """
    General helper method to replace non UTF-8 characters,
    """
    if not os.path.isfile(orig_path):
        raise "ERROR: Original file was not found"

    with open(orig_path, "r+", encoding="utf-8") as f:
        text = f.read()
        text = text.replace("\u2019", "'")
        text = text.replace("\u00bb", ">")
        text = text.replace("\uFEFF", "")

    with open(modified_path, "w") as f:
        f.write(text)


class CoreHelper:

    def __init__(self, content_desc, uuid):
        self.desc = CoreHelper.sanitize_description(content_desc)
        self.cluster_data = CoreHelper.extract_cluster_data(uuid)

    @staticmethod
    def sanitize_description(desc):
        # Preprocess some of the HTML so the server doesn't have to
        replace_strs = [
            ("<p align='left'>", ""),
            ('<p align="left">', ""),
            ("</p>", ""),
            ("face='Averia Serif'", ""),
            ('face="Averia Serif"', ""),
            ("size='20'", ""),
            ('size="20"', ""),
            ("size='21'", ""),
            ('size="21"', ""),
            ("size='30'", ""),
            ('size="30"', ""),
            ("<font color='a8a8a8'  >You may choose from:</font><br>", ""),
            ("<font color='a8a8a8'  >Click on this node again to allocate it, granting:</font><br>", ""),
            ("<br><br><font color='a8a8a8'  >Click on a node to view its properties.</font>", "")
        ]

        for old, new in replace_strs:
            desc = desc.replace(old, new)

        return desc.rstrip(",. ")

    @staticmethod
    def extract_cluster_data(uuid):
        # Split UUID for aspect, cluster and node values
        tokens = uuid.split("_")

        # There are some weird nodes in the localization formatted, for example:
        # AMER_UI_Ascension_Force_TheFalcon_Node_Node_0.0
        if tokens[5].startswith("Node"):
            if len(tokens) > 7 and "Node" in tokens[6]:
                return None, None, None, None

        aspect = tokens[3]
        cluster = format_cluster(tokens[4])
        cluster_attr = tokens[5]
        try:
            node = tokens[6]
        except IndexError:
            node = ""

        return aspect, cluster, cluster_attr, node


class NodeRewardsHelper:

    def __init__(self, line):
        self.tokens = NodeRewardsHelper.tns(line)

    @staticmethod
    def tns(line):
        tokens = (
            line[line.index("("):]
            .strip(".,;()\n ")
            .replace('"', '')
            .split(",")
        )
        return [t.strip() for t in tokens]

    def from_graph_link(self):
        cluster_tokens = self.tokens[1].split("_")

        aspect = cluster_tokens[0]
        cluster = format_cluster(cluster_tokens[1])
        from_node = " ".join(self.tokens[2].split("_"))
        to_node = " ".join(self.tokens[3].split("_"))

        return aspect, cluster, from_node, to_node

    def from_reward(self):
        cluster_tokens = self.tokens[0].split("_")

        aspect = cluster_tokens[0]
        cluster = format_cluster(cluster_tokens[1])
        node = " ".join(self.tokens[1].split("_"))

        return aspect, cluster, node


class DerpysAdditionsHelper:

    def __init__(self, clusterline, descline):
        self.cluster_data = DerpysAdditionsHelper.extract_cluster_data(clusterline)
        self.desc = DerpysAdditionsHelper.extract_description(descline)

    @staticmethod
    def extract_cluster_data(line):
        tokens = DerpysAdditionsHelper.tns_clusterline(line)

        aspect = tokens[0].split("_")[0]
        cluster = format_cluster(tokens[0].split("_")[1])
        node = f"Node {tokens[1]}.{tokens[2]}"

        return aspect, cluster, node

    @staticmethod
    def tns_clusterline(line):
        replace_strs = [
            ('"', ''),
            ("(", ""),
            ("{", ""),
            ("}", "")
        ]

        tokens = line[line.index("("):]

        for old, new in replace_strs:
            tokens = tokens.replace(old, new)

        tokens = tokens.strip("., ").split(",")

        return [t.strip() for t in tokens]

    @staticmethod
    def extract_description(line):
        tokens = DerpysAdditionsHelper.tns_descline(line)
        return format_derpys_desc(tokens[1])

    @staticmethod
    def tns_descline(line):
        tokens = (
            line
            .replace('"', '')
            .strip("., ")
            .split("=")
        )
        return [t.strip() for t in tokens]


class DerpysReplacementsHelper:

    def __init__(self, cluster_text, desc):
        self.cluster_data = DerpysReplacementsHelper.extract_cluster_data(cluster_text)
        self.desc = DerpysReplacementsHelper.s_description(desc)

    @staticmethod
    def extract_cluster_data(text):
        tokens = text.split('"')[1].strip('"[] ').split("_")

        aspect = tokens[0]
        cluster = format_cluster(tokens[1])
        node = f"{tokens[2]} {tokens[3]}"

        return aspect, cluster, node

    @staticmethod
    def s_description(desc):
        return format_derpys_desc(desc.replace('"', ''))


def format_derpys_desc(desc):
    for keyword in EE_KEY_WORDS:
        desc = desc.replace(keyword, HTML_COLOR_KEYWORD(keyword))
    desc = desc.replace("<br><br>", f'<br>{HTML_GT} ')
    desc = f"{HTML_GT} {desc}"

    return desc


def format_cluster(cluster):
    if cluster.startswith("The"):
        cluster = f"The {cluster[3:]}"
    elif cluster.startswith("BloodApe"):
        cluster = "Blood Ape"

    return cluster


def descs_are_same(desc1, desc2, threshold=0.95):
    def no_punctuation(s):
        return "".join(c for c in s.lower() if c not in string.punctuation and not c.isspace())

    def levenshtein(s1, s2):
        return SequenceMatcher(None, s1, s2).ratio() >= threshold

    return levenshtein(no_punctuation(desc1), no_punctuation(desc2))
