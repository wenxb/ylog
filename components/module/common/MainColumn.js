const MainColumn = ({children}) => {
    return (
        <div className="relative w-[650px] border-r border-l flex flex-col h-full max-xl:w-[600px] max-md:w-full max-sm:border-none">
            <div className={'flex flex-col grow'}>
                {children}
            </div>
        </div>
    );
};

export default MainColumn;
