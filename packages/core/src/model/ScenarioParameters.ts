import { ensure, isDefined, Serialised, TinyType } from 'tiny-types';

import { Description } from './Description';
import { Name } from './Name';

export class ScenarioParameters extends TinyType {
    public static fromJSON(o: Serialised<ScenarioParameters>) {
        return new ScenarioParameters(
            Name.fromJSON(o.name as string),
            o.description && Description.fromJSON(o.description as string),
            (o as any).values,
        );
    }

    constructor(
        public readonly name: Name,
        public readonly description: Description,
        public readonly values: { [ parameter: string ]: string },
    ) {
        super();

        ensure('name', name, isDefined());
        ensure('values', values, isDefined());
    }
}
