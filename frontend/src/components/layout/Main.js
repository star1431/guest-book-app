const Main = ({ children }) => {
    return (
        <main className="ui-main w-full m-0">
            <div className="w-full max-w-[120rem] mx-auto px-[2rem] m-0">
                {children}
            </div>
        </main>
    );
};

export default Main;
