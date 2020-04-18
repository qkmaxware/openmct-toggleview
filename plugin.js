const toggleview = function() {
    var cssGood = "s-status-on";
    var cssBad = "s-status-error";

    var view_key = 'view.toggle-view';

    return function install(openmct) {
        openmct.types.addType(view_key, {
            name: 'Toggle Switch Grid',
            description: 'Grid of switch that toggles between ON and OFF states for enumerable telemetry',
            cssClass: "icon-thumbs-strip",
            creatable: true,
            initialize: function(domain) {
                domain.composition = [];
            },
            form: [
                {
                    "key": "ok.value",
                    "name": "Ok Value",
                    "control": "textfield",
                    "value": "ON",
                    "required": true,
                    "cssClass": "l-input-lg"
                },
            ]
        })
        openmct.objectViews.addProvider({
            key: view_key,
            name: "Toggle Switch View",
            canView: function(domain) {
                return domain.type === view_key;
            },
            view: function(domain) {
                var container = null;
                var unsubs = null;

                function setGood(view) {
                    view.style.backgroundColor = "green";
                }
                function setBad(view) {
                    view.style.backgroundColor = "red";
                }

                return {
                    show: function(dom) {
                        var composition = domain.composition || [];
                        var views = [];
                        views.length = composition.length;
                        unsubs = [];
                        unsubs.length = composition.length;

                        container = document.createElement("div");
                        for (var i = 0; i < composition.length; i++) {
                            // Basic styling
                            var toggle = document.createElement("div");
                            toggle.style.display = "inline-block";
                            toggle.style.color = "white";
                            toggle.style.padding = "12px";
                            toggle.style.margin = "4px";
                            toggle.style.backgroundColor = "red";
                            container.appendChild(toggle);
                            toggle.innerText = composition[i].key;
                            views[i] = (toggle);
                        }

                        dom.appendChild(container);

                        // Must get object and subscribe to changes
                        composition.forEach((compsitionId, index) => {
                            var view = views[index];
                            openmct.objects.get(compsitionId).then(function(compositionDomain) {
                                var telemetry = null;
                                if (compositionDomain.telemetry && compositionDomain.telemetry.values) {
                                    telemetry = compositionDomain.telemetry.values.filter((tele) => {
                                        return tele.format === "enum";
                                    });
                                } else {
                                    telemetry = [];
                                }
                                telemetry = (telemetry.length > 0 ? telemetry[0] : null); // first element

                                var unsub = openmct.telemetry.subscribe(compositionDomain, function(dataPoint) {
                                    if (!telemetry)
                                        return; // enforce that we have to have some form of telemetry

                                    var name = telemetry.source || telemetry.key;
                                    var value = dataPoint[name];
                                    var cases = telemetry.enumerations.filter((e) => {
                                        return e.value === value
                                    });
                                    for (var icase = 0; icase < cases.length; icase++) {
                                        if (cases[icase].string === domain["ok.value"]) {
                                            setGood(view);
                                            return;
                                        }
                                    }
                                    setBad(view);
                                });
                                unsubs[index] = (unsub);
                            });
                        });
                    },
                    destroy: function() {
                        if (container != null) {
                            container.remove();
                        }

                        // must unsubscribe from changes
                        if (unsubs != null) {
                            for (var i = 0; i < unsubs.length; i++) {
                                if (unsubs[i]) {
                                    unsubs[i]();
                                }
                            }
                        }
                    }
                };
            },
            canEdit: function(domain) {
                return false;
            },
            priority: function () {
                return 1;
            }
        });

        console.log("toggleview plugin installed");
    }
}