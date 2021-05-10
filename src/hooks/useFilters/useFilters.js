import { useState } from "react"

export default function useFilters() {
    const [filters, setFilters] = useState({});
    const [filtersChanged, setFiltersChanged] = useState(false);

    const updateFilters = filter => {
        setFilters((prevState, props) => {
            return { ...prevState, [filter]: !prevState[filter] };
        })
        setFiltersChanged(!filtersChanged)
    }

    return { filters, updateFilters, filtersChanged}
}
