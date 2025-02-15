import { Meteor } from "meteor/meteor";
import { setGlobalMethodPipeline } from "meteor/zodern:relay";
import { Axiom } from "@axiomhq/js";

const axiom = new Axiom({
  token: "xaat-62ac2f30-8912-4f45-a447-cac45bd4562d",
});
export function loggedInPipeline<T>(input: T) {
  if (!this.userId) {
    throw new Error("You must be logged in to add a product");
  }
  return {...input, userId: this.userId};
}

function logResult<T>(input: T, pipeline: any) {
  if (pipeline.type === "publication") {
    return;
  }

  pipeline.onResult((result: any) => {
    if (Meteor.isProduction) {
      axiom.ingest("leadsnet", [{ pipeline, result, type: "success" }]);
    }
  });

  pipeline.onError((error: any) => {
    console.log(`Method ${pipeline.name} failed`);
    console.log("Error", error);
    if (Meteor.isProduction) {
      axiom.ingest("leadsnet", [{ pipeline, error, type: "error" }]);
    }
  });

  return input;
}

const flattenObj = ob => {
  // The object which contains the
  // final result
  let result = {};

  // loop through the object "ob"
  for (const i in ob) {
    // We check the type of the i using
    // typeof() function and recursively
    // call the function again
    if (typeof ob[i] === "object" && !Array.isArray(ob[i])) {
      const temp = flattenObj(ob[i]);
      for (const j in temp) {
        // Store temp in result
        result[i + "." + j] = temp[j];
      }
    }

    // Else store ob[i] in result directly
    else {
      result[i] = ob[i];
    }
  }
  return result;
};

function filterParams(input: any) {
  if (!input.filters) {
    return input;
  }
  const filters = Object.entries(input.filters).reduce((obj, item) => {
    const fieldName = item[0];
    const fieldValue = item[1];

    //Check if the filter is a search type
    if (fieldName === "search") {
      if (!fieldValue.searchText) {
        return obj;
      }
      return {
        ...obj,
        $or: fieldValue.fields.map(field => ({
          [field]: { $regex: fieldValue.searchText, $options: "i" },
        })),
      };
    }

    //Check if the filter is a boolean type
    if (typeof fieldValue === "boolean") {
      return {
        ...obj,
        [fieldName]: fieldValue,
      };
    }

    //Check if the filter is a date range type or a multiple select type
    if (Array.isArray(fieldValue)) {
      if (fieldValue.length === 0 || !fieldValue.every(value => !!value)) {
        return obj;
      }
      //Check if the values are with type date
      if (
        fieldValue.every(value => new Date(value).toString() !== "Invalid Date") &&
        fieldValue.length === 2
      ) {
        return {
          ...obj,
          [fieldName]: { $gte: new Date(fieldValue[0]), $lte: new Date(fieldValue[1]) },
        };
      } else {
        return {
          ...obj,
          [fieldName]: { $in: fieldValue },
        };
      }
    }
    return { ...obj, [fieldName]: fieldValue }; //Return as is
  }, {});
  return { ...input, filters };
}

function optionsParams(input: any) {
  if (!input.options) {
    return input;
  }

  const options = {
    limit: input.options.limit,
    skip: input.options.skip,
    sort: {},
  };

  if (input.options.sort) {
    options.sort[input.options.sort.field] = input.options.sort.direction ? -1 : 1;
  }

  return { ...input, options };
}
setGlobalMethodPipeline(logResult, filterParams, optionsParams);
