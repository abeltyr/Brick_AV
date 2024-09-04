
export const monthConverter = (index: number) => {
    if (index > 12) {
        return "Nehase"
    }
    let month = [
        "Meskerem",
        "Tikimt",
        "Hidar",
        "Tahisas",
        "Tir",
        "Yekakit",
        "Megbit",
        "Miyazia",
        "Ginbot",
        "Sene",
        "Hamle",
        "Nehase"
    ];
    return month[index - 1]
}