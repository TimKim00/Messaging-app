import PropTypes from "prop-types";

export default function Tooltip({children, text="Tooltip text", direction="top"}) {
    return (
        <div className="tooltip">
            {children}
            <span className={`tooltiptext ${direction}`}>{text}</span>
        </div>
    )
}
Tooltip.propTypes= {
    children: PropTypes.any,
    text: PropTypes.string,
    direction: PropTypes.string,
}
