

export default function RotationText ({data}) {
    return <p>
        {data.map((notation, index) => {
            return (index===0?"":", ") + notation.toString()
        })}
    </p>
}