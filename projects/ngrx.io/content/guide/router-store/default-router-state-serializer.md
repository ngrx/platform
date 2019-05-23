# Default Router State Serializer

If no router state serializer is provided through the [configuration](guide/router-store/configuration) of router store, the `DefaultRouterStateSerializer` is used. This router state serializer, serializes the URL together with the [ActivatedRouteSnapshot](https://angular.io/api/router/ActivatedRouteSnapshot) from [Angular Router](https://angular.io/guide/router). The latter is serialized recursively but without the recursive references.
