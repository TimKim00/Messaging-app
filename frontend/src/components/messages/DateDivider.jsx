import PropTypes from "prop-types"

export default function DateDivider({date}) {
    return (<div>{date}</div>)
}

DateDivider.propTypes = {
    date: PropTypes.any.isRequired,
}