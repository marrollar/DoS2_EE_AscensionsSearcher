import KeyWord from "@/app/components/Keyword"
import { KeyWordsCtx } from "@/app/components/KeywordsContext"
import { useContext } from "react"

export default function ArtifactsTable({ orig, derpys }: Readonly<{ orig: string, derpys: string }>) {
    const keywordsCtx = useContext(KeyWordsCtx)

    const all_keywords = new Set(Object.keys(keywordsCtx))
    all_keywords.add("Violent Strike")
    all_keywords.add("Withered")
    all_keywords.delete("Wither")
    const keywords_regexp = new RegExp(`(${[...all_keywords].join('|')})`, 'gi')

    const orig_tokens = orig.split(keywords_regexp)
    const derpys_tokens = derpys.split(keywords_regexp)

    return (
        <table className="w-full table-fixed border-collapse mt-1">
            <tbody>
                <tr>
                    <td className="w-1/2 bg-base-100 border border-base-300 px-2 py-1 align-top">
                        {
                            orig_tokens.map((e, index) => {
                                const isKeyword = all_keywords.has(e)
                                return isKeyword ? (
                                    <KeyWord key={index} keyword={e} />
                                ) : (
                                    <span key={index} dangerouslySetInnerHTML={{ __html: e }} />
                                )
                            })
                        }
                    </td>
                    <td className="w-1/2 bg-base-100 border border-base-300 px-2 py-1 align-top">
                        {
                            derpys_tokens?.map((e, index) => {
                                const isKeyword = all_keywords.has(e)
                                return isKeyword ? (
                                    <KeyWord key={index} keyword={e} />
                                ) : (
                                    <span key={index} dangerouslySetInnerHTML={{ __html: e }} />
                                )
                            })
                        }
                    </td>
                </tr>
            </tbody>
        </table>
    )
}