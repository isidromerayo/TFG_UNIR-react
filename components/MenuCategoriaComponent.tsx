import Link from "next/link"

export default function MenuCategoriaComponent({ data }) {
    console.log(data)

    return (

        data.map(item => (
            <li key={item.id}>
                <Link href={`/categoria/${item.id}`} key={item.id}>{item.nombre}</Link>
            </li>
        )
        )
    )
}