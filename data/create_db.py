import argparse
import os
import shutil
import sqlite3

from artifacts_pipeline import (
    parse_artifacts_geartype,
    parse_artifacts_icons,
    parse_derpys_artifact_descriptions,
    parse_orig_artifact_descriptions,
)
from ascensions_pipeline import (
    create_final_table,
    parse_derpys_changes,
    parse_for_corrections,
    parse_for_descriptions,
    rectify_edge_cases,
)
from constants import (
    AMER_ICONS_DDS,
    AMER_ICONS_LSX,
    MODIFIED_DERPYS_LOCAL,
    MODIFIED_EE_LOCAL,
    ORIGINAL_DERPYS_LOCAL,
    ORIGINAL_EE_LOCAL,
)
from icon_ripper import rip_icons
from parse_helpers import clean_bad_chars
from sql import DB_NAME, ORM_DIR
from tqdm import tqdm

TEMP_INTERMEDIATE_TABLES = True

conn = sqlite3.connect(DB_NAME)
cur = conn.cursor()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--with-overwrite",
        help="Allows the file to automatically copy the final database over to the website and overwrite an existing "
             "one there.",
        action="store_true",
    )

    args = parser.parse_args()

    """ Ascensions Processing """

    tqdm.write("Sanitizing localization files")
    clean_bad_chars(ORIGINAL_EE_LOCAL, MODIFIED_EE_LOCAL)
    clean_bad_chars(ORIGINAL_DERPYS_LOCAL, MODIFIED_DERPYS_LOCAL)

    parse_for_descriptions(cur, conn, TEMP_INTERMEDIATE_TABLES)
    parse_for_corrections(cur, conn, TEMP_INTERMEDIATE_TABLES)
    create_final_table(cur, conn)
    parse_derpys_changes(cur, conn)
    rectify_edge_cases(cur, conn)

    """ Artifacts Processing """

    rip_icons(AMER_ICONS_DDS, AMER_ICONS_LSX)

    artifacts = parse_artifacts_geartype(cur, conn)
    artifacts = parse_artifacts_icons(artifacts)
    artifacts = parse_orig_artifact_descriptions(artifacts)
    parse_derpys_artifact_descriptions(cur, conn, artifacts)

    conn.close()

    if args.with_overwrite:
        print("-- OVERWRITING DATABASE FILE --")
        shutil.move(DB_NAME, os.path.join(ORM_DIR, DB_NAME))
