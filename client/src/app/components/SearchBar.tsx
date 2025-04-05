import { ChangeEventHandler } from "react"

export default function SearchBar({
    onChangeHandler,
    defaultValue
}: Readonly<{ onChangeHandler: ChangeEventHandler<HTMLInputElement>, defaultValue: string | undefined }>) {
    return (
        <input
            type="text"
            onChange={onChangeHandler}
            className="mx-4 my-4 px-2 py-2 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Keyword search..."
            defaultValue={defaultValue}
        >
        </input>
    )

}
