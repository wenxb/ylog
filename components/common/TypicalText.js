"use client"
import {TypeAnimation} from "react-type-animation"

const TypicalText = ({text = [], ...props}) => {
    const newArr = []
    text.forEach((item) => {
        newArr.push(item, 3000)
    })

    return <TypeAnimation {...props} sequence={newArr} wrapper="p" speed={1} repeat={Infinity} />
}

export default TypicalText
