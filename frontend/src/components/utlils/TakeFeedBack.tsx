import React from 'react'

const TakeFeedBack = ({ratings}) => {
  return (
    <div>
      <h1 className='font-semibold'>Take FeedBack!</h1>
      <div>
      <div className="max-w-sm mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Feedback Ratings</h2>
      <div className="space-y-2">
        {ratings.map((rate, index) => (
          <div key={index} className="flex items-center space-x-3">
            <span className="w-6 text-sm font-medium text-gray-600">{rate.rating}★</span>
            <div className="w-full h-4 bg-gray-200 rounded-lg overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{ width: `${Math.ceil(rate.percentage)}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-600">
              {Math.ceil(rate.percentage)}%
            </span>
          </div>
        ))}
      </div>
    </div>
      </div>
    </div>
  )
}

export default TakeFeedBack
