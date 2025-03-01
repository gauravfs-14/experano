interface BlurProps {
    className?: string;
  }

  const Blur: React.FC<BlurProps> = ({ className = '' }) => {
    return (
      <div className="relative">
        <div
          className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 ${className} group hover:cursor-pointer animate-fade-in`}
          aria-hidden="true"
        >
          {/* Modal */}
          <div className="hidden group-hover:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-6 rounded-lg shadow-lg z-50 max-w-md w-full animate-slide-up">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">
            Profile Incomplete
              </h3>
              <p className="text-white">
            Please complete your profile before we recommend your interest events.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Blur;