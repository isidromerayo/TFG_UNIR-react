
export default function MenuCategoriaComponent({ data }) {

    return data ? ('') : (

        data.map(item => (
            <li key={item.id}>
                <Link href={`/categoria/${item.id}`} key={item.id}>{item.nombre}</Link>
            </li>
        )
        )
    )
}