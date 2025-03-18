
function Header() {
    return (<header className="fixed top-0 w-full backdrop-blur-md bg-black/50 p-4 shadow-md flex justify-between items-center px-8 z-50">
        <h1 className="text-2xl font-bold text-white px-3">Smart Post</h1>
        <nav>
          <ul className="flex space-x-6 text-white">
            <li><a href="#features" className="hover:text-gray-400">Features</a></li>
            <li><a href="#pricing" className="hover:text-gray-400">Pricing</a></li>
            <li><a href="#pricing" className="hover:text-gray-400">Contact</a></li>
          </ul>
        </nav>
        </header>);
};

export default Header;