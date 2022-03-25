import { hasProperty, isDefined, isNumber } from '@apigames/json';
import { GeospatialPoint } from '../interfaces';

export function LoadDateTime(value: string): Date {
  if (isDefined(value)) return new Date(value);
  return undefined;
}

// eslint-disable-next-line no-use-before-define
export function LoadGeospatialPoint(value: any): GeospatialPoint {
  if (isDefined(value) && hasProperty(value, 'longitude') && isNumber(value.longitude)
        && hasProperty(value, 'latitude') && isNumber(value.latitude)) {
    // eslint-disable-next-line no-use-before-define
    const geospatialPoint = new GeospatialPoint();
    geospatialPoint.LoadData(value);
    return geospatialPoint;
  }

  return undefined;
}
