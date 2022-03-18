import mongoose, { Schema } from 'mongoose';

const PageMapScheme = new Schema({
  _id: Schema.Types.String,
  pathToPage: [Schema.Types.String],
});

const PageMapModel = mongoose.models.pageMap || mongoose.model('pageMap', PageMapScheme, 'PageMap');

export default PageMapModel;
