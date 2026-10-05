// Migrated from ../aurexo/add-listings-2.html lines 1065-1075.
export default function CarPriceSection() {
  return (
    <div className="dashboard-box bg-white style-3 mb-30">
      <p className="h4 mb-20">Harga Mobil</p>
      <div className="grid grid-cols-4 gap-20 md-grid-cols-2 sm-grid-cols-1">
        <div className="padding-0 col-span-4">
          <p className="mb-8 font-weight-600">Price ($)*</p>
          <input className="input-large" type="text" id="PriceListing2" name="PriceListing" placeholder="e.g.1000" required />
        </div>
      </div>
    </div>
  );
}
