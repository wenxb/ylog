import NextLink from "next/link"

const Link = (props) => {
    return <NextLink {...props} target={"_blank"}></NextLink>
}

export default Link
