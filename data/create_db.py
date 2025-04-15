import argparse
import os
import shutil
import sqlite3

from ascensions_pipeline import (
    parse_for_descriptions,
    parse_for_corrections,
    create_final_table,
    parse_derpys_changes,
    rectify_edge_cases,
)
from constants import (
    MODIFIED_EE_LOCAL,
    ORIGINAL_EE_LOCAL,
    ORIGINAL_DERPYS_LOCAL,
    MODIFIED_DERPYS_LOCAL,
)
from parse_helpers import clean_bad_chars
from sql import DB_NAME, ORM_DIR

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
    print(args)

    print("Sanitizing localization files")
    clean_bad_chars(ORIGINAL_EE_LOCAL, MODIFIED_EE_LOCAL)
    clean_bad_chars(ORIGINAL_DERPYS_LOCAL, MODIFIED_DERPYS_LOCAL)

    print("Parsing for descriptions")
    parse_for_descriptions()

    print("Parsing for corrections")
    parse_for_corrections()

    print("Creating final ground truth table")
    create_final_table()

    print("Parsing for Derpy's changes")
    parse_derpys_changes()

    print("Fixing edge cases")
    rectify_edge_cases()

    conn.close()

    if args.with_overwrite:
        print("-- OVERWRITING DATABASE FILE --")
        shutil.move(DB_NAME, os.path.join(ORM_DIR, DB_NAME))
