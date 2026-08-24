// Migrated from ../aurexo/add-listings-2.html lines 1118-1128.
export default function VideoSection() {
  return (
    <div className="dashboard-box bg-white style-3 mb-30">
      <p className="h4 mb-20">Video</p>
      <div className="grid grid-cols-4 gap-20 md-grid-cols-1">
        <div className="padding-0 col-span-4">
          <p className="mb-8 font-weight-600">Video URL*</p>
          <input className="input-large" type="text" id="Yoururl" name="Yoururl" placeholder="Your url" required />
        </div>
      </div>
    </div>
  );
}
