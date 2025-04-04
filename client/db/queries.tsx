import { Aspects } from "@/types";
import prismaClient from "./client";

export async function getAllOriginalNodes() {
    return await prismaClient.$queryRaw`
        SELECT * FROM nodes
    `
}

export async function getDerpysChanges() {
    return await prismaClient.$queryRaw`
        SELECT * FROM derpys
    `
}

export async function getOriginalNodesByAspect(aspect: Aspects) {
    return await prismaClient.nodes.findMany({
        where: { aspect: aspect }
    })
}

export async function getUniqueClusters() {
    return await prismaClient.nodes.findMany({
        distinct: ["cluster"],
        select: {
            cluster: true
        },
    })
}

export async function getOriginalByCluster(cluster: string) {
    return await prismaClient.nodes.findMany({
        where: { cluster: cluster }
    })
}

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