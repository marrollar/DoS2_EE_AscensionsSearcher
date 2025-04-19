import prismaClient from "./client";


export async function getDerpysByCluster(cluster: string) {
    return await prismaClient.derpys.findMany({
        where: { cluster: cluster }
    })
}

export async function getDescription_By_ClusterAndAttr(cluster: string, attr: string) {
    return await prismaClient.nodes.findFirstOrThrow({
        where: {
            AND: [
                { cluster: cluster },
                { attr: attr }
            ]
        },
        select: {
            description: true
        }
    })
}

export async function getOriginal_MainNodes_By_Cluster(cluster: string) {
    return await prismaClient.nodes.findMany({
        where: {
            AND: [
                {
                    attr: {
                        contains: "Node"
                    }
                },
                { cluster: cluster },
                { is_subnode: 0 }
            ]
        }
    })
}

export async function getOriginal_SubNodes_By_Cluster(cluster: string) {
    return await prismaClient.nodes.findMany({
        where: {
            AND: [
                {
                    attr: {
                        contains: "Node"
                    }
                },
                { cluster: cluster },
                { is_subnode: 1 }
            ]
        }
    })
}

export async function getArtifacts() {
    return await prismaClient.artifacts.findMany({
        select: {
            aname: true,
            orig: true,
            derpys: true,
            icon: true,
            slot:true
        }
    })
}