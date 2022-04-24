import { StyledRangeButtons } from "../styles"

const TimeRangeButtons = ({ activeRange, setActiveRange }) => {

    return (
        <StyledRangeButtons>
                <li>
                    <button onClick={() => setActiveRange('short')} className={activeRange === 'short' ? 'active' : ''}>
                        This Month
                    </button>
                </li>
                <li>
                    <button onClick={() => setActiveRange('medium')} className={activeRange === 'medium' ? 'active' : ''}>
                        Last 6 Months
                    </button>
                </li>
                <li>
                    <button onClick={() => setActiveRange('long')} className={activeRange === 'long' ? 'active' : ''}>
                        All Time
                    </button>
                </li>
            </StyledRangeButtons>
    )
}

export default TimeRangeButtons
