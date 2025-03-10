import Link from "next/link"

interface Categoria {
    id: number;
    nombre: string;
}

export default function MenuCategoriaComponent({ data }: { data: Categoria[] }) {
    if (!Array.isArray(data)) {
        return null;
    }

    return (
        data.map((item: Categoria) => (
            <li key={item.id}>
                <Link href={`/categoria/${item.id}`}>{item.nombre}</Link>
            </li>
        ))
    );
}