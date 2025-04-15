import os

DB_NAME = "ascensions.db"
ORM_DIR = "../client/prisma"

if not os.path.isdir(ORM_DIR):
    raise (
        "ERROR: The website's ORM folder was not found. Please check to see the repo was cloned properly."
    )


class _sql_type:
    def __init__(self, name, t, extras=""):
        self.n = name
        self.t = t
        self.e = extras

    def __str__(self):
        return f"{self.n}"

    def full(self):
        return f"{self.n} {self.t} {self.e}"


class _MetaTable(type):
    def __str__(cls):
        static_attrs = {
            k: v for k, v in cls.__dict__.items() if isinstance(v, _sql_type)
        }
        return ", ".join(v.full() for v in static_attrs.values())


class t_CORE(metaclass=_MetaTable):
    _name = "core"
    href = _sql_type("href", "TEXT", "NOT NULL")
    aspect = _sql_type("aspect", "TEXT", "NOT NULL")
    cluster = _sql_type("cluster", "TEXT", "NOT NULL")
    attr = _sql_type("attr", "TEXT", "NOT NULL")
    description = _sql_type("description", "TEXT", "NOT NULL")
    is_subnode = _sql_type("is_subnode", "INTEGER")
    has_implicit = _sql_type("has_implicit", "INTEGER")


def CREATE_TABLE_CORE(cursor, conn, temp=True):
    cursor.execute(f"DROP TABLE IF EXISTS {t_CORE._name}")
    cursor.execute(f"""
        CREATE {"TEMP" if temp else ""} TABLE {t_CORE._name} (
            {t_CORE},

            PRIMARY KEY (
                {t_CORE.aspect}, 
                {t_CORE.cluster}, 
                {t_CORE.attr}
            )
        )
    """)
    conn.commit()


def INSERT_TABLE_CORE(cursor, conn, *args):
    kw = {}
    for arg in args:
        kw[arg[0]] = arg[1].strip() if isinstance(arg[1], str) else arg[1]

    cursor.execute(f"""
        INSERT INTO {t_CORE._name} ({",".join([str(k) for k in kw.keys()])})
        VALUES ({("?," * len(kw)).rstrip(",")})
    """, tuple(kw.values()))
    conn.commit()


class t_NODE_REWARDS(metaclass=_MetaTable):
    _name = "node_rewards"
    aspect = _sql_type("aspect", "TEXT", "NOT NULL")
    cluster = _sql_type("cluster", "TEXT", "NOT NULL")
    node = _sql_type("node", "TEXT", "NOT NULL")


def CREATE_TABLE_NODE_REWARDS(cursor, conn, temp=True):
    cursor.execute(f"DROP TABLE IF EXISTS {t_NODE_REWARDS._name}")
    cursor.execute(f"""
        CREATE {"TEMP" if temp else ""} TABLE {t_NODE_REWARDS._name} (
            {t_NODE_REWARDS},

            PRIMARY KEY (
                {t_NODE_REWARDS.aspect}, 
                {t_NODE_REWARDS.cluster}, 
                {t_NODE_REWARDS.node}
            )
        )
    """)
    conn.commit()


def INSERT_TABLE_NODE_REWARDS(cursor, conn, *args):
    kw = {}
    for arg in args:
        kw[arg[0]] = arg[1].strip() if isinstance(arg[1], str) else arg[1]

    cursor.execute(f"""
        INSERT OR IGNORE INTO {t_NODE_REWARDS._name} ({",".join([str(k) for k in kw.keys()])})
        VALUES ({("?," * len(kw)).rstrip(",")})
    """, tuple(kw.values()))
    conn.commit()


class t_NODES(metaclass=_MetaTable):
    _name = "nodes"
    href = _sql_type("href", "TEXT", "NOT NULL")
    aspect = _sql_type("aspect", "TEXT", "NOT NULL")
    cluster = _sql_type("cluster", "TEXT", "NOT NULL")
    attr = _sql_type("attr", "TEXT", "NOT NULL")
    description = _sql_type("description", "TEXT", "NOT NULL")
    is_subnode = _sql_type("is_subnode", "INTEGER")
    has_implicit = _sql_type("has_implicit", "INTEGER")


def CREATE_TABLE_NODES(cursor, conn, temp=False):
    cursor.execute(f"DROP TABLE IF EXISTS {t_NODES._name}")
    cursor.execute(f"""
        CREATE {"TEMP" if temp else ""} TABLE {t_NODES._name} (
            {t_NODES},

            PRIMARY KEY (
                {t_NODES.aspect}, 
                {t_NODES.cluster}, 
                {t_NODES.attr}
            )
        )
    """)
    conn.commit()


class t_DERPYS(metaclass=_MetaTable):
    _name = "derpys"
    aspect = _sql_type("aspect", "TEXT", "NOT NULL")
    cluster = _sql_type("cluster", "TEXT", "NOT NULL")
    node = _sql_type("node", "TEXT", "NOT NULL")
    description = _sql_type("description", "TEXT", "NOT NULL")
    is_addition = _sql_type("is_addition", "INTEGER", "NOT NULL")


def CREATE_TABLE_DERPYS(cursor, conn, temp=False):
    cursor.execute(f"DROP TABLE IF EXISTS {t_DERPYS._name}")
    cursor.execute(f"""
        CREATE {"TEMP" if temp else ""} TABLE {t_DERPYS._name} (
            {t_DERPYS},

            PRIMARY KEY (
                {t_DERPYS.aspect}, 
                {t_DERPYS.cluster}, 
                {t_DERPYS.node}
            )
        )
    """)
    conn.commit()


def INSERT_TABLE_DERPYS(cursor, conn, *args):
    kw = {}
    for arg in args:
        kw[arg[0]] = arg[1].strip() if isinstance(arg[1], str) else arg[1]

    cursor.execute(
        f"""
            INSERT OR IGNORE INTO {t_DERPYS._name} ({",".join([str(k) for k in kw.keys()])})
            VALUES ({("?," * len(kw)).rstrip(",")})
            """,
        tuple(kw.values()),
    )
    conn.commit()


class t_ARTIFACTS(metaclass=_MetaTable):
    _name = "artifacts"
    href = _sql_type("href", "TEXT", "NOT NULL")
    aname = _sql_type("aname", "TEXT", "NOT NULL")
    orig = _sql_type("orig", "TEXT", "NOT NULL")
    derpys = _sql_type("derpys", "TEXT", 'DEFAULT ""')


def CREATE_TABLE_ARTIFACTS(cursor, conn):
    cursor.execute(f"DROP TABLE IF EXISTS {t_ARTIFACTS._name}")
    cursor.execute(f"""
        CREATE TABLE {t_ARTIFACTS._name} (
            {t_ARTIFACTS},
        
            PRIMARY KEY({t_ARTIFACTS.aname})
        )
    """)
    conn.commit()


def INSERT_TABLE_ARTIFACTS(cursor, conn, *args):
    kw = {}
    for arg in args:
        kw[arg[0]] = arg[1].strip() if isinstance(arg[1], str) else arg[1]

    cursor.execute(f"""
        INSERT OR IGNORE INTO {t_ARTIFACTS._name} ({",".join([str(k) for k in kw.keys()])})
        VALUES ({("?," * len(kw)).rstrip(",")})
        """, tuple(kw.values()))
    conn.commit()