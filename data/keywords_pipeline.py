import re

from bs4 import BeautifulSoup
from tqdm import tqdm

from constants import MODIFIED_EE_LOCAL, MODIFIED_DERPYS_LOCAL
from sql import INSERT_TABLE_KEYWORDS, t_KEYWORDS, CREATE_TABLE_KEYWORDS


def sanitize_description(desc):
    generated_replacements = [
        f'<p align="center"><font color="ebc8{n:02}" size="26" face="Averia Serif">'
        for n in range(8, 28)
    ]

    replace_strs = [
                       (s, "") for s in generated_replacements
                   ] + [
                       ('</font></p>', ""),
                       ('<br></p>', ""),
                       ('size="20"', ""),
                       ('face="Averia Serif"', ""),
                       ('<p align="left">', ""),
                       ('</p>', "")
                   ]

    for old, new in replace_strs:
        desc = desc.replace(old, new)

    return desc.strip()


def parse_keyword_descriptions(cur, conn):
    CREATE_TABLE_KEYWORDS(cur, conn)
    PREFIX = "AMER_UI_Ascension_KeywordDesc_"

    with open(MODIFIED_EE_LOCAL, "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f.read(), "xml")

        for node in tqdm(soup.find_all(id="TranslatedStringKey"), desc="Extracting descriptions for keywords"):
            uuid = node.find("attribute", id="UUID").get("value")

            if uuid.startswith(PREFIX):
                content = node.find("attribute", id="Content")
                href = content.get("handle")
                description = sanitize_description(content.get("value"))
                keyword = uuid.split(PREFIX)[1]

                description = description.split(":", 1)[1]
                if keyword == "Elementalist" or keyword == "Predator":
                    description = \
                    description.split('<br><font color="cb9780">></font> <font color="ebc808"  >Reaction:</font>')[0]
                keyword = re.sub(r"([a-z])([A-Z])", r"\1 \2", keyword)

                INSERT_TABLE_KEYWORDS(
                    cur,
                    conn,
                    (t_KEYWORDS.href, href),
                    (t_KEYWORDS.keyword, keyword),
                    (t_KEYWORDS.orig, description)
                )

    with open(MODIFIED_DERPYS_LOCAL, "r") as f:
        soup = BeautifulSoup(f, "xml")

        for tag in soup.find_all("content"):
            content_id = tag.get("contentuid")

            keyword_data = cur.execute(f"""
                SELECT * FROM {t_KEYWORDS._name}
                WHERE {t_KEYWORDS.href}=?
            """, (content_id,)).fetchall()

            if len(keyword_data) > 0:
                assert len(keyword_data) == 1

                description = sanitize_description(tag.text)
                description = description.split(":", 1)[1]
                if keyword == "Elementalist":
                    description = \
                    description.split('<br><font color="cb9780">></font> <font color="ebc808"  >Reaction:</font>')[0]


                cur.execute(f"""
                    UPDATE {t_KEYWORDS._name}
                    SET {t_KEYWORDS.derpys}=?
                    WHERE {t_KEYWORDS.href}=?
                """, (description, keyword_data[0][0]))
                conn.commit()
