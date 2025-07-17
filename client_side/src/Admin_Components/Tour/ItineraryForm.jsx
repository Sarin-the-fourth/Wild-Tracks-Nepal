import { useEffect, useState } from "react";
import { useAdminStore } from "../../Store/useAdminStore";

const ItineraryForm = ({
  itineraryList,
  setItineraryList,
  currentStep,
  setStep,
  totalDays,
  onBackToTour,
  tourData,
  onSubmit,
}) => {
  const [entry, setEntry] = useState({
    day: currentStep + 1,
    title: "",
    description: "",
  });

  const { loadingAddTour } = useAdminStore();

  useEffect(() => {
    if (itineraryList[currentStep]) {
      setEntry(itineraryList[currentStep]);
    } else {
      setEntry({
        day: currentStep + 1,
        title: "",
        description: "",
      });
    }
  }, [currentStep, itineraryList]);

  const handleNext = () => {
    const updatedList = [...itineraryList];
    updatedList[currentStep] = entry;
    setItineraryList(updatedList);

    if (currentStep < totalDays - 1) {
      setStep(currentStep + 1);
    } else {
      const completeTourData = {
        ...tourData,
        itinerary: updatedList,
      };
      onSubmit(completeTourData);
    }
  };

  const handleBack = () => {
    const updatedList = [...itineraryList];
    updatedList[currentStep] = entry;
    setItineraryList(updatedList);
    setStep(currentStep - 1);
  };

  return (
    <div className="w-full items-center bg-[rgb(34,40,49)]  p-6 rounded-lg shadow-md">
      <h2 className="text-4xl font-bold font-bebas text-white mb-6">
        Day {entry.day}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-lg font-medium font-montserrat text-white mb-1">
            Title
          </label>
          <input
            type="text"
            placeholder="Activity title"
            value={entry.title}
            onChange={(e) => setEntry({ ...entry, title: e.target.value })}
            className="w-full px-4 py-2 border bg-white font-montserrat rounded-md focus:outline-none focus:font-montserrat focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-lg font-medium font-montserrat text-white mb-1">
            Description
          </label>
          <textarea
            placeholder="Detailed description of the day's activities"
            value={entry.description}
            onChange={(e) =>
              setEntry({ ...entry, description: e.target.value })
            }
            className="w-full px-4 py-2 border font-montserrat bg-white rounded-md focus:outline-none focus:font-montserrat focus:border-transparent"
            rows="5"
          />
        </div>

        <div className="flex justify-between pt-2">
          <div>
            {currentStep === 0 ? (
              <button
                onClick={onBackToTour}
                className="bg-gray-500 font-montserrat font-medium text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Back to Tour
              </button>
            ) : (
              <button
                onClick={handleBack}
                className="bg-gray-500 font-montserrat font-medium text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Previous Day
              </button>
            )}
          </div>

          <button
            onClick={handleNext}
            className={` text-black font-montserrat font-medium px-6 py-2 rounded-md  transition-colors duration-200  ${
              loadingAddTour
                ? "cursor-not-allowed bg-gray-600"
                : "bg-yellow-500 hover:bg-yellow-300 focus:bg-black focus:text-white"
            }`}
            disabled={!entry.title}
          >
            {currentStep < totalDays - 1
              ? "Next Day"
              : loadingAddTour
              ? "Adding Tour...."
              : "Finish"}
          </button>
        </div>

        <div className="pt-4">
          <div className="flex items-center justify-center space-x-2">
            {Array.from({ length: totalDays }).map((_, index) => (
              <div
                key={index}
                onClick={() => {
                  const updatedList = [...itineraryList];
                  updatedList[currentStep] = entry;
                  setItineraryList(updatedList);
                  setStep(index);
                }}
                className={`w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ${
                  index <= currentStep
                    ? "bg-gray-600 text-white"
                    : "bg-gray-600 text-white"
                } ${index === currentStep ? "ring-1 ring-gray-300" : ""}`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItineraryForm;
