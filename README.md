# CriticalSnake

Record an replay CriticalMaps data.

## This is a hack in progress

You can currently navigate to the [post-processing playground](https://weliveindetail.github.io/CriticalSnake/postprocess.html), load one of the manually recorded raw datasets from [test/datasets](https://github.com/weliveindetail/CriticalSnake/tree/master/test/datasets) and have a look. You will get the idea.

## Playback automation

A way to automate the process was added during https://cyclehackberlin.de/ 2019. The following options can now be passed as URL parameters:

* `city`: City names as defined in [getCoordFilter()](https://github.com/criticalmaps/criticalmaps-snake/blob/646d0d12276c499a5e9aef254f05b708124e4d43/critical-snake/utils.js#L2), try `Berlin` or `Barcelona`.
* `bounds`: Manual bounds in Leaflet [LatLngBounds](https://leafletjs.com/reference-1.5.0.html#latlngbounds) compatible notation, e.g. `[[52.40,13.23],[52.61,13.56]]`. When given, this overwrites the `city` parameter.
* `dataset`: The dataset URL to replay automatically.
* `fps`: Replay speed in frames per second as integer.
* `show_stats`: Visibility of the stats widget (shows date, time and number of bikes) as boolean.
* `show_controls`: Visibility of the playback controls widget (play, pause and skip frames) as boolean.
* `show_zoom`: Visibility of the zoom buttons as boolean.
* `colors`: Show different colors for different snakes as boolean.
* `group_dist`: Maximum distance between participants in a group (map units as float).
* `group_size`: Minimum size of a group to form a snake (as integer).
* `algorithm`: Postprocessing algorithm, options: simple, per-frame


## Spoiler

![Preview](img/CriticalSnake.gif)
