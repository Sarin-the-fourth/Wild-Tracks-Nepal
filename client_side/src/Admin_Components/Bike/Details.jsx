import { useBikeStore } from "../../Store/useBikeStore";
import { useEffect } from "react";

const Details = () => {
  const { bikeModelCount, fetchBikes, bikes } = useBikeStore();

  useEffect(() => {
    fetchBikes();
  }, []);

  return (
    <>
      <div className="col-start-2 col-end-3 bg-[rgb(34,40,49)] p-6 rounded-lg shadow-md w-full mb-5">
        <div>
          <div className="overflow-x-auto">
            <h1 className="font-bebas text-center text-5xl text-white mb-5">
              Bike Availability
            </h1>
            <table className="min-w-full text-left text-white border border-gray-600">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-2 border font-montserrat font-semibold border-gray-600">
                    Bikes
                  </th>
                  <th className="px-4 py-2 border font-montserrat font-semibold border-gray-600">
                    Bikes Available
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(bikeModelCount).map(([model, count]) => (
                  <tr key={model}>
                    <td className="px-4 py-2 border font-montserrat font-light border-gray-600">
                      {model}
                    </td>
                    <td className="px-4 py-2 border font-montserrat font-light border-gray-600">
                      {count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="col-start-2 col-end-3 bg-[rgb(34,40,49)] p-6 rounded-lg shadow-md w-full">
        <div className="overflow-x-auto">
          <h1 className="font-bebas text-center text-5xl text-white mb-5">
            Bike Details
          </h1>
          <table className="min-w-full text-left text-white border border-gray-600">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-2 border font-montserrat font-semibold border-gray-600">
                  Brand
                </th>
                <th className="px-4 py-2 border font-montserrat font-semibold border-gray-600">
                  Model
                </th>
                <th className="px-4 py-2 border font-montserrat font-semibold border-gray-600">
                  Registration Number
                </th>
                <th className="px-4 py-2 border font-montserrat font-semibold border-gray-600">
                  Condition
                </th>
                <th className="px-4 py-2 border font-montserrat font-semibold border-gray-600">
                  Price
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(
                bikes.reduce((acc, bike) => {
                  acc[bike.bike_brand] = acc[bike.bike_brand] || [];
                  acc[bike.bike_brand].push(bike);
                  return acc;
                }, {})
              ).map(([brand, groupedBikes]) =>
                groupedBikes.map((bike, idx) => (
                  <tr key={`${brand}-${idx}`}>
                    {idx === 0 ? (
                      <td
                        className="px-4 py-2 border font-montserrat font-light border-gray-600"
                        rowSpan={groupedBikes.length}
                      >
                        {brand}
                      </td>
                    ) : null}
                    <td className="px-4 py-2 border font-montserrat font-light border-gray-600">
                      {bike.bike_model}
                    </td>
                    <td className="px-4 py-2 border font-montserrat font-light border-gray-600">
                      {bike.bike_number}
                    </td>
                    <td className="px-4 py-2 border font-montserrat font-light border-gray-600">
                      {bike.condition}
                    </td>
                    <td className="px-4 py-2 border font-montserrat font-light border-gray-600">
                      {bike.bike_price}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Details;
