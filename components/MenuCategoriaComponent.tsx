import Link from "next/link"

export default function MenuCategoriaComponent({ data }:{data:any}) {

    return (

        data.map((item:any) => (
            <li key={item.id}>
                <Link href={`/categoria/${item.id}`} key={item.id}>{item.nombre}</Link>
            </li>
        )
        )
    )
}