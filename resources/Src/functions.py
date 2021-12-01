# =====================
# Compute functions
# =====================

def dep(rw, v1, v2, debug=False):
    rw.set_debug(False)

    rw.reset_filter()
    rw_average = rw.average()

    rw.set_filter(v1)
    rw.filter()
    rw_v_average = rw.average()

    result = rw_v_average[v2] / rw_average[v2]

    if debug:
        print(rw_average)
        print(rw_v_average)
        print("Dep :", result)

    return result


def assoc(rw, v1, v2, debug=True):
    dep_result = dep(rw, v1, v2, debug=debug)

    result = 0 if dep_result <= 1 else 1 - 1 / dep_result

    if debug:
        print("Assoc :", result)

    return result


def d(v1, v2, voc):
    v1 = list(v1.keys())[0].split(".")[1]
    modnames = voc.partitions[v2.split(".")[0]].modnames

    v2 = v2.split(".")[1]
    result = abs(modnames.index(v1) - modnames.index(v2))

    print(result)


def atypical(rw, v1, v2, voc, debug=False):
    rw.set_debug(False)

    rw.reset_filter()
    rw_average = rw.average()

    rw.set_filter(v1)
    rw.filter()
    rw_v_average = rw.average()

    result = d(v1, v2, voc)
    # u \in R (SEUELEMNT LA PARTITION)


# =====================
# Questions
# =====================


def q1(rw):
    rw.reset_filter()
    rw.average()


def q2(rw):
    rw.reset_filter()
    filter = {
        "Distance.short": 0.5,
        "ArrDelay.long": 0.1
    }

    rw.set_filter(filter)
    rw.filter()

    rw.average()


def q3_assoc(rw):
    print("Low correlation")
    filter = {
        "DepTime.midday": 0.1
    }

    # This filter must contain only one criterion
    filter2 = "DepDelay.short"

    assoc(rw, filter, filter2)

    print("\nHigh correlation")
    filter = {
        "AirTime.medium": 0.1
    }

    # This filter must contain only one criterion
    filter2 = "Distance.long"

    assoc(rw, filter, filter2)


def q3_atypical(rw, voc):

    # This filter must contain only one criterion
    filter = {
        "DepTime.midday": 0.1
    }

    # This filter must contain only one criterion
    filter2 = "DepTime.morning"

    atypical(rw, filter, filter2, voc)
