
epsilon = 1e-15

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

    result = rw_v_average[v2] / max(rw_average[v2], epsilon) # Avoid div by 0

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


def d(partition_average, v1, v2):

    id1 = partition_average.index(v1)
    id2 = partition_average.index(v2)

    return (abs(id1 - id2) + 1)/len(partition_average)


def atypical(rw, v1, v2, debug=False):
    rw.set_debug(False)

    rw.reset_filter()
    rw.set_filter(v1)
    rw.filter()
    rw_v_average = rw.average()

    partition_average = {key: rw_v_average[key] for key in rw_v_average.keys() if key.startswith(v2.split(".")[0])}

    results = []
    keys = []
    for i in partition_average.keys():
        if i != v2:
            dist = d(list(partition_average.keys()), v2, i)
            covVR = partition_average[i]
            covv2R = 1 - partition_average[v2]
            print(dist, covVR, covv2R, min(dist, covVR, covv2R))
            results.append(min(dist, covVR, covv2R))
            keys.append(i)

    print(results)
    m = max(results)
    index = results.index(m)
    print(m, keys[index])
    return m
    # result = d(v1, v2, voc)
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

    print("High correlation")
    filter = {
        "ArrDelay.early": 0.9
    }

    # This filter must contain only one criterion
    filter2 = "DepTime.morning"

    assoc(rw, filter, filter2)

    print("\nLow correlation")
    filter = {
        "ArrDelay.early": 0.9
    }

    # This filter must contain only one criterion
    filter2 = "AirTime.medium"

    assoc(rw, filter, filter2)


def q3_atypical(rw):

    print("Terme atypique")
    # This filter must contain only one criterion
    filter = {
        "ArrDelay.early": 0.8
    }

    filter2 = "DepTime.evening"

    atypical(rw, filter, filter2)

    print("\nTerme peu atypique :")
    filter = {
        "ArrDelay.veryLong": 0.8
    }

    filter2 = "DepTime.evening"

    atypical(rw, filter, filter2)
