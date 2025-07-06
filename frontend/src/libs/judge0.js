const languageMap = {
    "PYTHON":71,
    "JAVA":62,
    "JAVASCRIPT":63,
    "CPP":54
}
const reverseLanguageMap = Object.fromEntries(
    Object.entries(languageMap).map(([key,value]) => [value,key])
)

export const getJudge0LanguageFromId = (id)=>{
    return reverseLanguageMap[id] || null
}
export const getJudge0LanguageId = (language)=>{
        return  languageMap[language.toUpperCase()]||null;
}