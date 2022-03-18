import mongoose, { Schema } from 'mongoose';

const PageTreeSchema = new Schema({
  _id: Schema.Types.String,
  subPages: Schema.Types.Array,
});

const PageTreeModel = mongoose.models.pageTree || mongoose.model('pageTree', PageTreeSchema, 'PageTree');

export default PageTreeModel;
