import React from "react";
import { Button } from "@/components/ui/button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function RoomAvailable({ roomListing }) {
  console.log('Room PGListingCard', roomListing)
  return (
<div className="flex flex-wrap gap-2 my-6">
  {roomListing?.map((a) => (
    <div key={a.id} className="flex-none">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">{a.title}</Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="flow-root rounded-lg border border-gray-100 py-3 shadow-sm">
            <dl className="-my-3 divide-y divide-gray-100 text-sm">
              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">Id</dt>
                <dd className="text-gray-700 sm:col-span-2">{a.id}</dd>
              </div>
              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">Title</dt>
                <dd className="text-gray-700 sm:col-span-2">{a.title}</dd>
              </div>
              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">Availability</dt>
                <dd className="text-gray-700 sm:col-span-2">{a.availability}</dd>
              </div>
              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">Price</dt>
                <dd className="text-gray-700 sm:col-span-2">Rs.{a.price}</dd>
              </div>
              <div className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                <dt className="font-medium text-gray-900">Sub Title</dt>
                <dd className="text-gray-700 sm:col-span-2">{a.description}</dd>
              </div>
              {JSON.parse(a.price_detail).map((m, index) => (
                <div key={index} className="grid grid-cols-1 gap-1 p-3 sm:grid-cols-3 sm:gap-4">
                  <dt className="font-medium text-gray-900">{m.priceType}</dt>
                  <dd className="text-gray-700 sm:col-span-2">Rs.{m.priceDetail}</dd>
                </div>
              ))}
            </dl>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  ))}
</div>

  );
}

export default RoomAvailable;
