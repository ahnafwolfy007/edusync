
const Footer = () => {
  return (
    <footer className="bg-[#101828] text-white py-16 px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-6xl mx-auto">
        <div>
          <h4 className="font-bold text-xl mb-4">EduSync</h4>
          <p className="text-gray-300">Making campus life easier and more connected for students everywhere.</p>
        </div>
        {['Features', 'Support', 'Connect'].map((section, i) => (
          <div key={i}>
            <h4 className="font-bold text-lg mb-4">{section}</h4>
            <ul className="space-y-2 text-gray-300">
              <li className="hover:text-white transition-colors duration-200 cursor-pointer">
                {section === 'Features' ? 'Marketplace' : section === 'Support' ? 'Help Center' : 'Instagram'}
              </li>
              <li className="hover:text-white transition-colors duration-200 cursor-pointer">
                {section === 'Features' ? 'Housing' : section === 'Support' ? 'Safety Center' : 'Twitter'}
              </li>
              <li className="hover:text-white transition-colors duration-200 cursor-pointer">
                {section === 'Features' ? 'Tutoring' : section === 'Support' ? 'Guidelines' : 'Facebook'}
              </li>
            </ul>
          </div>
        ))}
      </div>
      <p className="text-center text-gray-400 mt-16 text-sm">© 2025 EduSync. All rights reserved.</p>
    </footer>
  );
};

export default Footer;