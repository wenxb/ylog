import {cn} from "@/utils"

const MainColumn = ({children, className}) => {
    return (
        <div className={cn(
            "relative w-[650px] border-r border-l flex flex-col h-full max-xl:w-[600px] max-md:w-full max-sm:border-none",
            className
        )}>
            <div className={'flex flex-col grow'}>
                {children}
            </div>
        </div>
    );
};

export default MainColumn;
