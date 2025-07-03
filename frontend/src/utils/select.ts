//https://stackoverflow.com/questions/52614304/react-select-remove-focus-border
//https://stackoverflow.com/questions/58801252/possible-to-change-font-color-on-react-select
//https://react-select.com/styles

export const selectStyles = {
    control: (provided: any) => ({
        ...provided,
        minHeight: "40px",
        border: "none",
        boxShadow: "none",
        "&:hover": {
            border: "none", /* para n sobrescrever formatação da nossa borda*/
            
        },
    }),
    placeholder: (provided: any) => ({
        ...provided,
        color: "var(--color-font-placeholder)",
    }),
    option: (provided: any) => ({
        ...provided,
        color: "var(--color-font-primary)",
    }),
    indicatorSeparator: (provided: any) => ({
        ...provided,
        display: "none",  /* para tirar a barrinho pero ta seta de selecionar as opções*/
    }),
};