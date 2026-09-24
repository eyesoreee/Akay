import { column, Schema, Table } from "@powersync/react-native";

const Building = new Table(
  {
    // id column (text) is automatically included
    name: column.text,
    type: column.text,
    description: column.text,
    latitude: column.real,
    longitude: column.real,
    created_at: column.text,
    updated_at: column.text,
  },
  { indexes: {} },
);

export const AppSchema = new Schema({
  Building,
});

export type Database = (typeof AppSchema)["types"];
